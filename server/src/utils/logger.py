import logging

# Configure logging globally
logging.basicConfig(
    level=logging.INFO,  # Set log level to INFO
    format="%(asctime)s - %(levelname)s - %(module)s - %(message)s",
    handlers=[
        logging.FileHandler("app.log"),  # Logs to a file
        logging.StreamHandler()  # Also logs to the console
    ]
)

# Create a logger that can be imported in other files
logger = logging.getLogger("fastapi_project")
