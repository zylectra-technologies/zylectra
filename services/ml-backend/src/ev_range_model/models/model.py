import torch 
from torch import nn as nn
import numpy as np

class EvRangeModel(nn.Module):
    """
    LSTM-based regression model with input batch normalization,
    layer normalization, and residual fully connected layers for robust sequence modeling.
    """
    def __init__(self, input_dim, hidden_dim=128, num_layers=3, dropout=0.2):
        super().__init__()
        self.input_norm = nn.BatchNorm1d(input_dim)
        self.lstm = nn.LSTM(input_dim, hidden_dim, num_layers, batch_first=True,
                            dropout=dropout if num_layers > 1 else 0)
        self.layer_norm = nn.LayerNorm(hidden_dim)
        self.fc_layers = nn.ModuleList([
            nn.Linear(hidden_dim, hidden_dim),
            nn.Linear(hidden_dim, hidden_dim // 2),
            nn.Linear(hidden_dim // 2, 1)
        ])
        self.relu = nn.ReLU()
        self.dropout = nn.Dropout(dropout)

    def forward(self, x):
        batch_size, seq_len, features = x.shape
        x_reshaped = x.view(-1, features)
        x_norm = self.input_norm(x_reshaped)
        x = x_norm.view(batch_size, seq_len, features)

        lstm_out, _ = self.lstm(x)
        lstm_out = self.layer_norm(lstm_out)
        out = lstm_out[:, -1, :]  # last hidden state

        for i, fc in enumerate(self.fc_layers[:-1]):
            out_fc = fc(out)
            out_fc = self.relu(out_fc)
            out_fc = self.dropout(out_fc)
            # only add residual if shapes match
            if out.shape[-1] == out_fc.shape[-1]:
                out = out + out_fc
            else:
                out = out_fc


        out = self.fc_layers[-1](out)
        return out