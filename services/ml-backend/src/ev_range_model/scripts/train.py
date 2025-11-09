import numpy as np 
import pandas as pd 
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, TensorDataset
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error
import logging
import matplotlib.pyplot as plt
import warnings
from models.model import EvRangeModel
warnings.filterwarnings('ignore')

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class Config:
    """
    Configuration settings for training the ev_range model,
    including model hyperparameters, training parameters, and dataset split ratios.
    """
    HIDDEN_DIM = 128
    NUM_LAYERS = 3
    DROPOUT = 0.2
    SEQUENCE_LENGTH = 50

    BATCH_SIZE = 32
    LEARNING_RATE = 0.001
    EPOCHS = 200
    PATIENCE = 20

    TEST_SIZE = 0.2
    VAL_SIZE = 0.1

class EVRangeProcessor:
    """
    Handles preprocessing of EV telemetry data into LSTM-ready sequences.
    """

    def __init__(self, config):
        self.config = config
        self.scaler_X = StandardScaler()
        self.scaler_y = StandardScaler()

    def preprocess_data(self, file_path):
        logger.info("Preprocessing data...")

        # Load data
        df = pd.read_csv(file_path)
        df.columns = [c.strip().lower() for c in df.columns]  # normalize header names

        # --- Identify Columns ---
        target_col = 'remaining_range_km'
        time_col = [c for c in df.columns if 'timestamp' in c][0]

        # Convert timestamp → datetime + sort
        df[time_col] = pd.to_datetime(df[time_col])
        df = df.sort_values(time_col).reset_index(drop=True)

        # Extract target
        y = df[target_col].values.reshape(-1, 1)

        # Drop non-numeric or non-useful columns
        drop_cols = [
            time_col,          # not a model input
            target_col,        # kept separately
            'bms_version',     # categorical string
            'fault_code',      # often not numeric (and very sparse)
            'balancing_active' # boolean category 
        ]
        df.drop(columns=[c for c in drop_cols if c in df.columns], inplace=True)

        df = df.select_dtypes(include=[np.number])

        # Scale features + target separately
        X_scaled = self.scaler_X.fit_transform(df)
        y_scaled = self.scaler_y.fit_transform(y)

        # Create sequences for LSTM
        X_seq, y_seq = self.create_sequences(X_scaled, y_scaled)

        input_dim = X_seq.shape[2]
        logger.info(f"Preprocessed: {len(X_seq)} sequences | {input_dim} features")

        return X_seq, y_seq, input_dim


    def create_sequences(self, X, y):
        seq_len = self.config.SEQUENCE_LENGTH
        X_seq, y_seq = [], []
        for i in range(len(X) - seq_len):
            X_seq.append(X[i:i + seq_len])
            y_seq.append(y[i + seq_len])
        return np.array(X_seq), np.array(y_seq).flatten()

    def inverse_transform_target(self, y_scaled):
        return self.scaler_y.inverse_transform(y_scaled.reshape(-1, 1)).flatten()

class EarlyStopping:
    def __init__(self, patience=7, min_delta=0):
        self.patience = patience
        self.min_delta = min_delta
        self.counter = 0
        self.best_loss = float('inf')

    def __call__(self, val_loss):
        if val_loss < self.best_loss - self.min_delta:
            self.best_loss = val_loss
            self.counter = 0
            return False
        else:
            self.counter += 1
            return self.counter >= self.patience
        
class EvRangeTrainer :
    def __init__(self,config=Config()):
        self.config = config
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        logger.info(f"Using device: {self.device}")
    
    def create_data_loaders(self, X_seq, y_seq):
        X_temp, X_test, y_temp, y_test = train_test_split(X_seq, y_seq, test_size=self.config.TEST_SIZE, random_state=42)
        X_train, X_val, y_train, y_val = train_test_split(X_temp, y_temp, test_size=self.config.VAL_SIZE/(1-self.config.TEST_SIZE), random_state=42)

        train_loader = DataLoader(TensorDataset(torch.tensor(X_train, dtype=torch.float32),
                                                torch.tensor(y_train, dtype=torch.float32)),
                                    batch_size=self.config.BATCH_SIZE, shuffle=True)
        val_loader = DataLoader(TensorDataset(torch.tensor(X_val, dtype=torch.float32),
                                                torch.tensor(y_val, dtype=torch.float32)),
                                batch_size=self.config.BATCH_SIZE, shuffle=False)
        test_loader = DataLoader(TensorDataset(torch.tensor(X_test, dtype=torch.float32),
                                                torch.tensor(y_test, dtype=torch.float32)),
                                    batch_size=self.config.BATCH_SIZE, shuffle=False)
        logger.info(f"Training samples: {len(X_train)}, Validation: {len(X_val)}, Test: {len(X_test)}")
        return train_loader, val_loader, test_loader
    
    def train_epoch(self, model, loader, criterion, optimizer):
        model.train()
        total_loss = 0
        for X_batch, y_batch in loader:
            X_batch, y_batch = X_batch.to(self.device), y_batch.to(self.device)
            optimizer.zero_grad()
            loss = criterion(model(X_batch).squeeze(), y_batch)
            loss.backward()
            torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
            optimizer.step()
            total_loss += loss.item()
        return total_loss / len(loader)
    
    def validate_epoch(self, model, loader, criterion):
        model.eval()
        total_loss = 0
        with torch.no_grad():
            for X_batch, y_batch in loader:
                X_batch, y_batch = X_batch.to(self.device), y_batch.to(self.device)
                loss = criterion(model(X_batch).squeeze(), y_batch)
                total_loss += loss.item()
        return total_loss / len(loader)
    
    def train_model(self,data_file, model_path="models/feddback_model.pth"):
        processor = EVRangeProcessor(self.config)
        X_seq, y_seq, input_dim = processor.preprocess_data(data_file)
        train_loader, val_loader, test_loader = self.create_data_loaders(X_seq, y_seq)
        
        model = EvRangeModel(input_dim=input_dim,
                                    hidden_dim=self.config.HIDDEN_DIM,
                                    num_layers=self.config.NUM_LAYERS,
                                    dropout=self.config.DROPOUT).to(self.device)
        criterion = nn.MSELoss()
        optimizer = torch.optim.Adam(model.parameters(), lr=self.config.LEARNING_RATE)
        early_stopping = EarlyStopping(patience=self.config.PATIENCE)
        train_losses = []
        val_losses = []
        for epoch in range(self.config.EPOCHS):
            train_loss = self.train_epoch(model, train_loader, criterion, optimizer)
            val_loss = self.validate_epoch(model, val_loader, criterion)
            train_losses.append(train_loss)
            val_losses.append(val_loss)
            logger.info(f"Epoch {epoch + 1}/{self.config.EPOCHS} - Train Loss: {train_loss:.4f} - Validation Loss: {val_loss:.4f}")
            if early_stopping(val_loss):
                logger.info("Early stopping triggered.")
                break
        torch.save(model.state_dict(), model_path)
        logger.info(f"Model saved to {model_path}")
        self.plot_training_curves(train_losses, val_losses)
        return model, processor
    
    @staticmethod
    def plot_training_curves(train_losses, val_losses):
        plt.figure(figsize=(10, 6))
        plt.plot(train_losses, label='Train')
        plt.plot(val_losses, label='Validation')
        plt.xlabel('Epoch')
        plt.ylabel('Loss')
        plt.yscale('log')
        plt.title('Training Curves')
        plt.legend()
        plt.grid(True, alpha=0.3)
        plt.tight_layout()
        # plt.savefig('training_curves.png', dpi=300)
        plt.show()


if __name__ == "__main__":
    config = Config()
    trainer = EvRangeTrainer(config)
    data_file = "../data/mock_ev_bms_data.csv"   
    model, processor = trainer.train_model(data_file)
    logger.info("Training completed successfully!")