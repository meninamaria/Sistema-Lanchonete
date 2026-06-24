import os
from conexao import banco
from pathlib import Path
from PyQt5 import uic, QtWidgets

# conectar com o banco de dados
cursor = banco.cursor()

def gerenciar_funcionario():
    print("é fogo bbres")


def cadastrarFunc():
    telaFunc.close()
    telaFunc_cadastro.show()

    nome = telaFunc_cadastro.txt_nomeCadastroFunc.text()
    cpf = telaFunc_cadastro.txt_cpfcadastroFunc.text()
    salario = telaFunc_cadastro.txt_salarioCadastroFunc.text()
    funcao = telaFunc_cadastro.txt_funcaocadastroFunc.text()

    # falta colocar o botao bt_confirmarCadastro pra adicionar no BD

    comando_SQL = "INSERT INTO funcionario (salario, cpf, nome, funcao) VALUES (%s, %s, %s, %s)"
    dados = (float(salario), str(cpf), str(nome), str(funcao))
    cursor.execute(comando_SQL, dados)
    banco.commit()


def buscarFunc():
    id = telaFunc.txt_buscarFunc.text()
    comando_SQL = "SELECT * from funcionario WHERE idFunc = %s"
    dado = (str(id),)
    cursor.execute(comando_SQL, dado)
    busca = cursor.fetchall()

    telaFunc.tabela_funcionarios.setRowCount(len(busca))
    telaFunc.tabela_funcionarios.setColumnCount(5)

    for i in range(0, len(busca)):
         for j in range(0, 4):
            telaFunc.tabela_funcionarios.setItem(i, j, QtWidgets.QTableWidgetItem(str(busca[i][j])))
            


    # # Atualizar dados do funcionário
    # elif opcao == 3:
    #     cpf = str(input("Informe o CPF: "))
    #     comando_SQL = "SELECT * from funcionario WHERE cpf = %s"
    #     dado = (str(cpf),)
    #     cursor.execute(comando_SQL, dado)
    #     busca = cursor.fetchall()

    #     os.system('cls' if os.name == 'nt' else 'clear')

    #     if busca:
    #         print("--- Atualizar Informações ---")
    #         salario = float(input("Salário: R$ "))
    #         cpf = str(input("CPF: "))
    #         nome = str(input("Nome: "))
    #         funcao = str(input("Função: "))
    #         idFunc = busca[0][0]

    #         comando_SQL = "UPDATE funcionario SET salario = %s, cpf = %s, nome = %s, funcao = %s WHERE idFunc = %s"
    #         dados = (float(salario), str(cpf), str(nome), str(funcao), int(idFunc))
    #         cursor.execute(comando_SQL, dados)
    #         banco.commit()

    # # Excluir funcionário
    # elif opcao == 4:
    #     cpf = str(input("Informe o CPF: "))
    #     comando_SQL = "DELETE from funcionario WHERE cpf = %s"
    #     dado = (str(cpf),)
    #     cursor.execute(comando_SQL, dado)
    #     banco.commit()

    #     os.system('cls' if os.name == 'nt' else 'clear')
    #     print("Funcionário removido com sucesso!")

    # # Voltar para o MENU principal
    # elif opcao == 5:
    #     os.system('cls' if os.name == 'nt' else 'clear')
    #     return "voltar"

ui_path1 = Path(__file__).with_name("telaFuncionários.ui")
telaFunc = uic.loadUi(str(ui_path1))

ui_path2 = Path(__file__).with_name("telaFuncionários_cadastro.ui")
telaFunc_cadastro = uic.loadUi(str(ui_path2))

telaFunc.bt_cadastrarFunc.clicked.connect(cadastrarFunc)
telaFunc.bt_buscarFunc.clicked.connect(buscarFunc)
