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
        print("[1] - Gerenciamento")
        print("[2] - Gerenciar Pedido")  
        print("[3] - Gerenciar Mesa")
        print("[4] - Gerenciar Comidas")
        print("[5] - Sair")
        opcao = int(input("Digite a opção desejada: "))

        # Gerenciamento
        if opcao == 1:
            os.system('cls')

            print("Deseja gerenciar qual das opções: ")
            print("[1] para Cliente")
            print("[2] para Funcionário")
            escolha = int(input("Digite a opção desejada: "))

            # Gerenciar cliente
            if escolha == 1:
                print("--- Gerenciamento de Clientes ---")
                print("[1] - Cadastrar")
                print("[2] - Buscar")
                print("[3] - Atualizar")
                print("[4] - Excluir")
                print("[5] - Voltar")
                opcao = int(input("Digite a opção desejada: "))

                cursor = banco.cursor()
                os.system('cls')

                # Cadastrar cliente
                if opcao == 1:
                    nome = str(input("Digite o nome: "))
                    cpf = str(input("Digite o CPF: "))
                    telefone = str(input("Digite o número (formato: (XX) XXXXX-XXXX): "))

                    comando_SQL = "INSERT INTO cliente (telefone, cpf, nome) VALUES (%s, %s, %s)"
                    dados = (str(telefone), str(cpf), str(nome))
                    cursor.execute(comando_SQL, dados)
                    banco.commit()
                
                    os.system('cls')
                    print("Cliente cadastrado com sucesso!")

                # Buscar Cliente
                elif opcao == 2:
                    cpf = str(input("Informe o CPF: "))
                    comando_SQL = "SELECT * from cliente WHERE cpf = %s"
                    dado = (str(cpf),)
                    cursor.execute(comando_SQL, dado)
                    busca = cursor.fetchall()

                    os.system('cls')

                    print("--- Informações do Cliente ---")
                    for i in range(0, len(busca)) :
                        if busca[i][2] == cpf:
                            print(f"Nome: ", busca[i][3])
                            print(f"Código do CLiente: ", busca[i][0])
                            print(f"CPF: ", busca[i][2])
                            print(f"Telefone: ", busca[i][1])
                            print("-------------------------------")

                # Atualizar dados do cliente
                elif opcao == 3:
                    cpf = str(input("Informe o CPF: "))
                    comando_SQL = "SELECT * from cliente WHERE cpf = %s"
                    dado = (str(cpf),)
                    cursor.execute(comando_SQL, dado)
                    busca = cursor.fetchall()

                    os.system('cls')

                    if busca:
                        print("--- Atualizar Informações ---")
                        telefone = str(input("Telefone: "))
                        cpf = str(input("CPF: "))
                        nome = str(input("Nome: "))
                        idCli = busca[0][0]

                        comando_SQL = "UPDATE cliente SET telefone = %s, cpf = %s, nome = %s WHERE idCliente = %s"
                        dados = (str(telefone), str(cpf), str(nome), str(idCli))
                        cursor.execute(comando_SQL, dados)
                        banco.commit()

                # Excluir cliente
                elif opcao == 4:
                    cpf = str(input("Informe o CPF: "))
                    comando_SQL = "DELETE from cliente WHERE cpf = %s"
                    dado = (str(cpf),)
                    cursor.execute(comando_SQL, dado)
                    banco.commit()

                    os.system('cls')
                    print("Cliente removido com sucesso!")

                # Voltar para o MENU principal
                elif opcao == 5:
                    break

            # Gerenciar Funcionario
            elif escolha == 2:
                print("--- Gerenciamento de Funcionários ---")
                print("[1] - Cadastrar")
                print("[2] - Buscar")
                print("[3] - Atualizar")
                print("[4] - Excluir")
                opcao = int(input("Digite a opção desejada: "))

                cursor = banco.cursor()

                # Cadastrar funcionário
                if opcao == 1:
                    os.system('cls')
                    salario = float(input("Digite o salário: R$ "))
                    cpf = str(input("Digite o CPF: "))
                    nome = str(input("Digite o nome: "))
                    funcao = str(input("Digite a função: "))

                    comando_SQL = "INSERT INTO funcionario (salario, cpf, nome, funcao) VALUES (%s, %s, %s, %s)"
                    dados = (float(salario), str(cpf), str(nome), str(funcao))
                    cursor.execute(comando_SQL, dados)
                    banco.commit()

                    os.system('cls')
                    print("Funcionário cadastrado com sucesso!")

                # Buscar Funcionário
                elif opcao == 2:
                    cpf = str(input("Informe o CPF: "))
                    comando_SQL = "SELECT * from funcionario WHERE cpf = %s"
                    dado = (str(cpf),)
                    cursor.execute(comando_SQL, dado)
                    busca = cursor.fetchall()

                    os.system('cls')

                    print("--- Informações do Funcionário ---")
                    for i in range(0, len(busca)) :
                        if busca[i][2] == cpf:
                            print(f"Nome: ", busca[i][3])
                            print(f"Código do Funcionário: ", busca[i][0])
                            print(f"CPF: ", busca[i][2])
                            print(f"Salário: ", busca[i][1])
                            print(f"Função: ", busca[i][4])
                            print("-------------------------------")

                # Atualizar dados do funcionário
                elif opcao == 3:
                    cpf = str(input("Informe o CPF: "))
                    comando_SQL = "SELECT * from funcionário WHERE cpf = %s"
                    dado = (str(cpf),)
                    cursor.execute(comando_SQL, dado)
                    busca = cursor.fetchall()

                    os.system('cls')

                    if busca:
                        print("--- Atualizar Informações ---")
                        salario = str(input("Salário: R$ "))
                        cpf = str(input("CPF: "))
                        nome = str(input("Nome: "))
                        funcao = str(input("Função: "))
                        idFunc = busca[0][0]

                        comando_SQL = "UPDATE funcionario SET telefone = %s, cpf = %s, nome = %s, funcao = %s WHERE idFunc = %s"
                        dados = (str(telefone), str(cpf), str(nome), str(funcao), str(idFunc))
                        cursor.execute(comando_SQL, dados)
                        banco.commit()

                # Excluir cliente
                elif opcao == 4:
                    cpf = str(input("Informe o CPF: "))
                    comando_SQL = "DELETE from funcionario WHERE cpf = %s"
                    dado = (str(cpf),)
                    cursor.execute(comando_SQL, dado)
                    banco.commit()

                    os.system('cls')
                    print("Funcionário removido com sucesso!")
                                  
                # Voltar para o MENU principal
                elif opcao == 5:
                    break
        
        # Gerenciar pedido
        elif opcao == 2:
            print("Escolha uma opção: ")
            print("[1] - Fazer pedido")
            print("[2] - Remover pedido") 
            print("[3] - Atualizar pedido")
            print("[4] - Listar pedidos")
            print("[5] - Realizar Pagamento")
            print("[6] - Voltar")
            escolha = int(input("Escolha a opção desejada: "))
            cursor = banco.cursor()

            # Opção para fazer o pedido
            if escolha == 1:
                print("-------- Fazer Pedido --------")
                cpfCli = str(input("Informe o CPF do cliente: "))
                cpfFunc = str(input("Informe o CPF do funcionário: "))

                cursor = banco.cursor()
                comando_SQL = "SELECT idCliente, idFunc FROM cliente INNER JOIN funcionario WHERE cliente.cpf = %s AND funcionario.cpf = %s"
                dados = (str(cpfCli), str(cpfFunc))
                cursor.execute(comando_SQL, dados)
                busca = cursor.fetchall()

                # aqui significa que a busca teve sucesso em encontrar tanto o cliente e funcionário buscado
                if busca:
                    resultado_reserva = reservar_mesa()
                    if resultado_reserva != 0:

                        os.system('cls')
                        
                        # Mostrar as comidas que tem
                        exibir_cardapio()
                        
                        # Para fazer o pedido, precisa preencher esses atributos:
                        data = str(input("Data: "))
                        pedido = int(input("PEDIDO (insira o id): "))  

                        # pegar o preço da comida 
                        comando_SQL = "SELECT total from produto WHERE idProduto = %s"
                        dado = (int(pedido),)
                        cursor.execute(comando_SQL, dado)
                        valor = cursor.fetchall() 

                        if valor:
                            fazer_pedido(data, valor, busca[0][0], busca[0][1], resultado_reserva, pedido)              

                        os.system('cls')
                        print("Pedido feito com sucesso!")

            # Opção para remover o pedido
            elif escolha == 2:
                idPedido = int(input("Informe o id do pedido: "))

                comando_SQL = "DELETE from pedido WHERE idPedido = %s"
                dado = (int(idPedido),)
                cursor.execute(comando_SQL, dado)
                banco.commit()

                os.system('cls')
                print("Pedido removido com sucesso!")
            
            # Opção para atualizar pedido
            elif escolha == 3:
                data = str(input("Data: "))
                valor = float(input("Valor: R$"))
                idCli = int(input("Id do Cliente: "))
                idFunc = int(input("Id do Funcionário: "))
                idMesa = int(input("Id do Mesa: "))
                idProduto = int(input("Id do Produto: "))
                idPedido = int(input("Informe o id do pedido: "))
                res_idPedido = buscar_pedido(idPedido)
                
                comando_SQL = "UPDATE pedido SET data = %s, total = %s, idCliente = %s, idFunc = %s, idMesa = %s, idProduto = %s WHERE idPedido = %s"
                dados = (str(data), float(valor), int(idCli), int(idFunc), int(idMesa), int(idProduto), int(res_idPedido))
                cursor.execute(comando_SQL, dados)
                banco.commit()

                os.system('cls')
                print("Pedido atualizado com sucesso!")

            # Listar todos os pedidos
            elif escolha == 4:
                os.system('cls')
                listar_pedidos()

            # Fazer o pagamento--------------------------------------------------------------------------------------------------------------
            #elif escolha == 5:
                # Aqui tem que fazer com a que a mesa volte a ficar disponivel
                # além de outras coisas :D
                # Fiz, só que deve ta todo errado e confuso
                # Melhorar!!!
                # Criei um outro arquivo com o código que fiz, só pra tentar extrair o que é bom ou não: "pagamento.py"
                
            # Opção voltar
            elif escolha == 6:
                break

            else: 
                os.system('cls')
                print("Opção inválida!")

        # Gerenciar mesas
        elif opcao == 3:   
            print("Escolha uma opção: ")
            print("[1] - Cadastrar")
            print("[2] - Remover") 
            print("[3] - Listar")
            escolha = int(input("Escolha a opção desejada: "))
            cursor = banco.cursor()

            # Opção para cadastrar a mesa
            if escolha == 1:
                os.system('cls')
                print("---- Cadastro de mesas ----")

                status = "Disponível"
                numero = int(input("Informe o número da mesa: "))
                capacidade = int(input("Informe a capacidade: "))
                comando_SQL = "INSERT INTO mesa (status, numero, capacidade) VALUES (%s, %s, %s)"
                dados = (str(status), int(numero), int(capacidade))
                cursor.execute(comando_SQL, dados)
                banco.commit()

                print("Mesa cadastrada com sucesso!")

            # Opção para remover a mesa
            elif escolha == 2:
                os.system('cls')
                print("---- Remover mesa ----")

                numero = int(input("Informe o numero da mesa: "))
                buscar_mesa(numero)
                if buscar_mesa():
                    comando_SQL = "DELETE from mesa WHERE numero = %s"
                    dado = (int(numero),)
                    cursor.execute(comando_SQL, dado)
                    banco.commit()
            
            # Opção para listar todas as mesas cadastradas
            elif escolha == 3:
                os.system('cls')
                listar_mesas()

            else:
                os.system('cls')
                print("Opção inválida!")

        
        # Gerenciar as Comidas
        elif opcao == 5:
            # NOTA: QUERO MUDAR O NOME DISSO!!!!!! Produtos é muito peba, só que COMIDA ou ALIMENTO sinto que não engloba por exemplo as bebidas :/
            print("------ Gerenciar Produtos ------")
            print("[1] - Cadastrar Produto")
            print("[2] - Atualizar Produto")
            print("[3] - Exibir Cardápio")
            print("[4] - Remover Produto")
            escolha = int(input("Escolha a opção desejada: "))

            os.system('cls')

            # Cadastrar 
            if escolha == 1:
                print("----- Cadastro -----")
                nome = str(input("Informe o nome do produto: "))
                preco = float(input("Informe o preço: R$ "))
                exibir_categorias()
                idCategoria = int(input("Informe o id da categoria: "))

                comando_SQL = "INSERT INTO produto (nome, preco, idCategoria) VALUES (%s, %s, %s)"
                dados = (str(nome, float(preco), int(idCategoria)))
                cursor.execute(comando_SQL, dados)
                banco.commit()

                os.system('cls')
                print("Produto cadastrado com sucesso")

            # Atualizar 
            elif escolha == 2:
                print("----- Atualizar -----")
                idProd = int(input("Informe o id do produto:"))
                if buscar_produto(idProd) == 1:
                    nome = str(input("Informe o nome do produto: "))
                    preco = float(input("Informe o preço: R$ "))
                    exibir_categorias()
                    idCategoria = int(input("Informe o id da categoria: "))

                    comando_SQL = "UPDATE produto SET nome = %s, preco = %s, idCategoria = %s WHERE idProduto = %s"
                    dados = (str(nome), float(preco), int(idCategoria), int(idProd))
                    cursor.execute(comando_SQL, dados)
                    banco.commit()

                    os.system('cls')
                    print("Produto atualizado com sucesso!")

            elif escolha == 3:
                exibir_cardapio()

            # Remover pedido
            elif escolha == 4:
                idProd = int(input("Informe o id do produto:"))
                if buscar_produto(idProd) == 1:
                    comando_SQL = "DELETE from produto WHERE idProduto = %s"
                    dado = (int(idProd))
                    cursor.execute(comando_SQL, dado)
                    banco.commit()

                    os.system('cls')
                    print("Produto removido com sucesso!")
            else:
                print("Opção inválida!")

        # Sair do sistema
        elif opcao == 6:
            exit()

        # Quando o usuário digita um valor inválido
        else:
            os.system('cls')
            print("Opcao inválida! Tente Novamente.")


def buscar_produto(id):
    cursor = banco.cursor()
    comando_SQL = "SELECT * FROM produto WHERE idProduto = %s"
    dado = (int(id))
    cursor.execute(comando_SQL,dado)
    busca = cursor.fetchall()  

    if busca():
        return 1
    else:
        return 0


def exibir_categorias():
    cursor = banco.cursor()
    comando_SQL = "SELECT * from categoria"
    cursor.execute(comando_SQL)
    exibir = cursor.fetchall()

    if exibir():
        for i in range(0, len(exibir)):
            print("Nome: ",exibir[i][1])
            print("Id da categoria: ",exibir[i][0])
            print("-----------------------------")


def imprimir_nota_fiscal():
    cursor = banco.cursor()
    comando_SQL = "SELECT * FROM pagamento"
    cursor.execute(comando_SQL)
    imprimir_nota_fiscal = cursor.fetchall()

    os.system('cls')

    if imprimir_nota_fiscal:
        print("---- Nota Fiscal ----")
        for i in range(0, len(imprimir_nota_fiscal)):
            print("ID do pagamento: ", imprimir_nota_fiscal[i][0])
            print("Forma de pagamento: ", imprimir_nota_fiscal[i][1])
            print("Valor: R$", imprimir_nota_fiscal[i][2])
            print("ID do pedido: ", imprimir_nota_fiscal[i][3])
            print("----------------------------------------------")


def nota_fiscal(id):
    # Adicionando todas as comidas que o cliente irá pagar na tabela PAGAMENTO
    cursor = banco.cursor()
    listar_pedidos_cliente(id)
    print("------ Pagamento ------")
    idPedido = int(input("Selecione o pedido: "))

    comando_SQL = "SELECT total from pedido WHERE idPedido = %s"
    dado = (int(idPedido),)
    cursor.execute(comando_SQL, dado)
    precos = cursor.fetchall()

    # aqui tá acontecendo o seguinte: quando passar o id do pedido, o valor do pedido e o ID será adicionado na tabela pagamento
    if precos:
        comando_SQL = "INSERT INTO pagamento (valor, idPedido) VALUES (%s, %s)"
        dados = (float(precos[0]), int(idPedido),)
        cursor.execute(comando_SQL, dados)
        banco.commit()


def buscar_pedidos_cliente(id):
    contador = 0
    cursor = banco.cursor()
    comando_SQL = "SELECT idPedido, nome FROM pedido INNER JOIN produto WHERE idCliente = %s"
    dado = (int(id),)
    cursor.execute(comando_SQL, dado)
    buscar_pedidos_de_um_cliente = cursor.fetchall()

    if buscar_pedidos_de_um_cliente():
        for i in range(0, len(buscar_pedidos_de_um_cliente)):
            print("Nome: ", buscar_pedidos_de_um_cliente[i][1])
            print("Pedido: ", buscar_pedidos_de_um_cliente[i][0])
            print("----------------------------------------")
            contador += 1

    return contador
    


def listar_pedidos_cliente(id):
    cursor = banco.cursor()
    comando_SQL = "SELECT * from pedido WHERE idCliente = %s"
    dado = (int(id),)
    cursor.execute(comando_SQL, dado)
    listar_pedidos_de_um_cliente = cursor.fetchall()

    if listar_pedidos_de_um_cliente():
        comando_SQL = "SELECT nome FROM cliente WHERE idCliente = %s"
        dado = (int(id),)
        cursor.execute(comando_SQL, dado)
        nomeCliente = cursor.fetchall()

        print("Nota fiscal do cliente - ", nomeCliente[0][3])
        for i in range(0, len(listar_pedidos_de_um_cliente)):
            print(f"Id do pedido: ",listar_pedidos_de_um_cliente[i][0])
            print(f"Data do pedido: ",listar_pedidos_de_um_cliente[i][1])
            print(f"Valor: R$",listar_pedidos_de_um_cliente[i][2])
            print(f"Id do Cliente: ",listar_pedidos_de_um_cliente[i][3])
            print(f"Id do Funcionário: ",listar_pedidos_de_um_cliente[i][4])
            print(f"Id da Mesa: ",listar_pedidos_de_um_cliente[i][5])
            print(f"Id da Comida: ",listar_pedidos_de_um_cliente[i][6])
            print("-------------------------------------")


def buscar_cliente(cpf):
    cursor = banco.cursor()
    comando_SQL = "SELECT idCliente from cliente WHERE cpf = %s"
    dado = (str(cpf),)
    cursor.execute(comando_SQL, dado)
    busca = cursor.fetchall()

    if busca:
        return busca
    else:
        print("Nenhum cliente foi encontrado")
        return 0


def exibir_cardapio():
    # Mostrar o cardapio
    cursor = banco.cursor()
    comando_SQL = "SELECT * FROM produto"
    cursor.execute(comando_SQL)
    exibir_cardapio = cursor.fetchall()

    if exibir_cardapio:
        print("----- Exibir Cardápio ------")
        for i in range (0, len(exibir_cardapio)):
            print(f"Id da comida: ",exibir_cardapio[i][0])
            print(f"Nome: ",exibir_cardapio[i][1])
            print(f"Preço: ",exibir_cardapio[i][2])
            print(f"Id da categoria: ",exibir_cardapio[i][3])
            print("\n----------------------")


def fazer_pedido(data, valor, idCli, idFunc, idMesa, idProd):
    # Aqui basicamente é o processo de fazer um pedido
    cursor = banco.cursor()
    comando_SQL = "INSERT INTO pedido (data, total, idCliente, idFunc, idMesa, idProduto) VALUES (%s, %s, %s, %s, %s, %s)"
    dados = (str(data), float(valor), int(idCli), int(idFunc), int(idMesa), int(idProd))
    cursor.execute(comando_SQL, dados)
    banco.commit()


def buscar_pedido(id):
    # Buscar um pedido passando como parâmetro o ID
    cursor = banco.cursor()
    comando_SQL = "SELECT * from pedido WHERE idPedido = %s"
    dado = (int(id))
    cursor.execute(comando_SQL, dado)
    busca = cursor.fetchall()

    if busca:
        return id
    else:
        print("Nenhum pedido foi encontrado!")
        return 0


def listar_pedidos():
    # Mostrar todos os pedidos cadastrados
    cursor = banco.cursor()
    comando_SQL = "SELECT * from pedido"
    dado = (int(id))
    cursor.execute(comando_SQL, dado)
    busca = cursor.fetchall()

    if busca:
        os.system('cls')

        for i in range (0, len(busca)):
            print(f"Id do pedido: ",busca[i][0])
            print(f"Data do pedido: ",busca[i][1])
            print(f"Valor: R$",busca[i][2])
            print(f"Id do Cliente: ",busca[i][3])
            print(f"Id do Funcionário: ",busca[i][4])
            print(f"Id da Mesa: ",busca[i][5])
            print(f"Id da Comida: ",busca[i][6])


def buscar_mesa(numero):
    cursor = banco.cursor()
    comando_SQL = "SELECT * FROM mesa WHERE numero = %s"
    dado = (int(numero),)
    cursor.execute(comando_SQL, dado)
    busca = cursor.fetchall()

    if busca:
        return busca
    else:
        return 0


def listar_mesas():
    # Serve para mostrar TODAS as mesas cadastradas no sistema
    cursor = banco.cursor()
    comando_SQL = "SELECT * FROM mesa"
    cursor.execute(comando_SQL)
    exibir_mesas = cursor.fetchall()

    # Exibir as mesas
    if exibir_mesas:
        print("------- Listagem de Mesas -------")
        for i in range(0, len(exibir_mesas)):
            print(f"Id da mesa: ",exibir_mesas[i][0])
            print(f"Status: ",exibir_mesas[i][1])
            print(f"Numero: ",exibir_mesas[i][2])
            print(f"Capacidade: ",exibir_mesas[i][3])
            print("-------------------------")

def reservar_mesa():
    # Verificar no BD as mesas que tem disponivel
    cursor = banco.cursor()
    comando_SQL = "SELECT * FROM mesa WHERE status = 'Disponível'"
    cursor.execute(comando_SQL)
    exibir_mesas = cursor.fetchall()

    # Exibir as mesas
    if exibir_mesas:
        print("------- Mesas Disponíveis -------")
        for i in range(0, len(exibir_mesas)):
            print(f"Id da mesa: ",exibir_mesas[i][0])
            print(f"Status: ",exibir_mesas[i][1])
            print(f"Numero: ",exibir_mesas[i][2])
            print(f"Capacidade: ",exibir_mesas[i][3])
            print("-------------------------")
        
        reserva = int(input("Informe o id da mesa que será reservada: "))
        comando_SQL = "UPDATE mesa SET status = 'Ocupada' WHERE idMesa = %s"
        dado = (str(reserva),)
        cursor.execute(comando_SQL, dado)
        banco.commit()
        return reserva
    else:
        print("Não há nenhuma mesa cadastrada!")
        return 0



funcao_principal()