# Backend placeholder
# This file indicates the backend directory structure exists
# The actual FastAPI application will be implemented separately

FROM mambaorg/micromamba:1.5-focal

# Set working directory
WORKDIR /app

# Copy environment file
COPY environment.yml ./

# Create conda environment
RUN micromamba install -y -n base -f environment.yml && \
    micromamba clean --all --yes

# Copy application code
COPY . .

# Activate environment and set path
ENV PATH /opt/conda/envs/dainmedic/bin:$PATH

# Expose port
EXPOSE 8000

# Command will be overridden by docker-compose
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]