import pandas as pd

def get_key_metrics():
    try:
        # Recomendation file for stock reduction
        rec = pd.read_excel('output/recomendacao_estoque_6m_new.xlsx')
        
        # Check columns
        # print(rec.columns)
        
        # Assuming columns exist based on previous partial output or common sense for this task
        # Let's try to sum 'SALDO_ATUAL' and 'SALDO_RECOMENDADO' if they exist
        # If not, I will list columns to find the right ones.
        
        cols = [c.upper() for c in rec.columns]
        rec.columns = cols
        
        if 'VALOR_ESTOQUE_ATUAL' in cols and 'VALOR_ESTOQUE_RECOMENDADO' in cols:
            curr = rec['VALOR_ESTOQUE_ATUAL'].sum()
            reco = rec['VALOR_ESTOQUE_RECOMENDADO'].sum()
            reduction = (curr - reco) / curr * 100
            print(f"Stock Reduction Potential: {reduction:.1f}%")
            print(f"Current Value: R$ {curr:,.2f}")
            print(f"Recommended Value: R$ {reco:,.2f}")
        else:
            print("Columns for stock value not found immediately. Available:", cols)

    except Exception as e:
        print(f"Error in recommendation: {e}")

    try:
        # Results file for accuracy
        res = pd.read_excel('output/resultados_quantile_6m_new.xlsx')
        print("Results columns:", res.columns.tolist())
        # Likely has aggregated metrics
        print(res.head())
    except Exception as e:
        print(f"Error in results: {e}")

get_key_metrics()
