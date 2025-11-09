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