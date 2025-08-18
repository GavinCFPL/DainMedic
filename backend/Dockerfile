FROM continuumio/miniconda3

WORKDIR /app

# Create conda environment with RDKit
RUN conda create -n rdkit -c conda-forge python=3.11 rdkit-core rdkit -y

# Make RDKit environment the default
SHELL ["conda", "run", "-n", "rdkit", "/bin/bash", "-c"]

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN conda run -n rdkit pip install -r requirements.txt

# Copy application code
COPY . .

# Create data directories
RUN mkdir -p app/data/artifacts

# Expose port
EXPOSE 8000

# Run the application
CMD ["conda", "run", "--no-capture-output", "-n", "rdkit", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]