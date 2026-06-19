import mysql.connector as mysql_connector
import os

banco = mysql_connector.connect(
    host="localhost",
    user="root",
    passwd="Vieira_maria22",
    database="lanchonete"
)

# Atributos públicos


# Sistema começa aqui
def funcao_principal():
    print(f"Entrando no sistema da Lanchonete")

    while (True):
        # MENU
        print("------------Menu------------")  
        print("[1] - Cadastrar Cliente")
        print("[2] - Cadastrar Funcionário")  
        print("[3] - Fazer Login")
        print("[4] - Sair")
        opcao = int(input("Digite a opção desejada: "))

        # Cadastrar Cliente
        if opcao == 1:
            os.system('cls')
            nome = str(input("Digite seu nome: "))
            cpf = str(input("Digite seu CPF: "))
            telefone = str(input("Digite seu número (formato: (XX) XXXXX-XXXX): "))

            cursor = banco.cursor()
            comando_SQL = "INSERT INTO cliente (telefone, cpf, nome) VALUES (%s, %s, %s)"
            dados = (str(telefone), str(cpf), str(nome))
            cursor.execute(comando_SQL, dados)
            banco.commit()
            os.system('cls')

        # Cadastrar Funcionario
        elif opcao == 2:
            os.system('cls')
            nome = str(input("Digite seu nome: "))
            cpf = str(input("Digite seu CPF: "))
            salario = float(input("Informe seu salário: R$ "))

            cursor = banco.cursor()
            comando_SQL = "INSERT INTO funcionario (salario, cpf, nome) VALUES (%s, %s, %s)"
            dados = (float(salario), str(cpf), str(nome))
            cursor.execute(comando_SQL, dados)
            banco.commit()
            os.system('cls')

        # Fazer Login
        elif opcao == 3:
            os.system('cls')
            print("Selecione sua conta: ")
            print("[1] para Cliente")
            print("[2] para Funcionário")
            escolha = int(input("Digite a opção desejada: "))

            # Se a conta escolhida for Cliente
            if escolha == 1:
                os.system('cls')
                cursor = banco.cursor()

                # aqui tá verificando se existe o cpf CLIENTE cadastrado no sistema
                cpf = str(input("Digite seu CPF: "))
                comando_SQL = "SELECT * from cliente where cpf = %s"
                dado = (str(cpf),)
                cursor.execute(comando_SQL, dado)
                busca = cursor.fetchall()

                if busca:
                    os.system('cls')
                    print(f"Seja bem-vindo a Lanchonete SendYourWish, {busca[0][3]}")

                    print("------------Menu------------")
                    print("[1] - Fazer Pedido")

            # Se a conta escolhida for Funcionario
            elif escolha == 2:
                os.system('cls')
                cursor = banco.cursor()

                # aqui tá verificando se existe o cpf CLIENTE cadastrado no sistema
                cpf = str(input("Digite seu CPF: "))
                comando_SQL = "SELECT * from cliente where cpf = %s"
                dado = (str(cpf),)
                cursor.execute(comando_SQL, dado)
                busca = cursor.fetchall()

                if busca:
                    os.system('cls')


        # Sair do sistema
        elif opcao == 4:
            exit()

        # Quando o usuário digita um valor inválido
        else:
            print("Opcao inválida! Tente Novamente.")



funcao_principal()