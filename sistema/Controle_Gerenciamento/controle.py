import mysql.connector as mysql_connector

banco = mysql_connector.connect(
    host="localhost",
    user="root",
    passwd="Vieira_maria22",
    database="lanchonete"
)

def funcao_principal():
    print(f"Entrando no sistema da Lanchonete")