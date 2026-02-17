import pandas as pd
import json

try:
    df = pd.read_excel('data/BASE_VENDAS_ESTOQUE_DN_IVO.xlsx')

    # Example Metrics - we adjust based on actual columns found
    # Let's inspect columns first
    print(f"Columns: {df.columns.tolist()}")

    # Try to calculate some metrics if possible
    # Assuming columns like 'Sales', 'Stock', 'Date' etc. exist or similar.
    # If not, I'll print the head to see what's inside.
    
    # For now, just outputting basic info to stdout so I can read it
    print(df.head().to_markdown())
    print(df.describe().to_markdown())

except Exception as e:
    print(f"Error reading excel: {e}")
