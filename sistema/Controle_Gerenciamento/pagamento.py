os.system('cls')

                cpf = str(input("Informe o CPF: "))
                # aqui vai procurar o cliente com o cpf informado
                idCli = buscar_cliente(cpf)

                # cpf encontrado
                if idCli != 0:
                    # exibir todos os pedido do cliente pesquisado
                    listar_pedidos_cliente(idCli)
                    continuar = 'S' # variavel só para começar o WHILE

                    while continuar != 'N' or continuar != 'n':
                        # aqui é pra ficar adicionando os pedidos que o cliente vai pagar na tabela PAGAMENTO
                        nota_fiscal(idCli)
                        continuar = str(input("Continuar adicionando? [S/N]"))
                        if continuar != 'S' or continuar != 's':
                            print("Opção inválida!")
                            break
                    
                    os.system('cls')
                    
                    # quando parar de adicionar os pedidos da tabela PAGAMENTO..
                    print("--- Forma de Pagamento ---")
                    print("[1] - Pix")
                    print("[2] - Cartão de Crédito")
                    print("[3] - Cartão de Débito")
                    print("[4] - Dinheiro")

                    opcao_forma_pag = int(input("Opção escolhida: "))
                    # aqui é pra setar o valor do atributo FORMA de pagamento
                    comando_SQL = "UPDATE pagamento SET forma = %s"

                    if opcao_forma_pag == 1:
                        dado = (str("Pix"))
                    elif opcao_forma_pag == 2:
                        dado = (str("Cartão de Crédito")) 
                    elif opcao_forma_pag == 3:
                        dado = (str("Cartão de Débito")) 
                    elif opcao_forma_pag == 4:
                        dado = (str("Dinheiro"))
                    else:
                        while opcao_forma_pag > 1 and opcao_forma_pag < 4:
                            print("Opção inválida")
                            opcao_forma_pag = int(input("Opção escolhida: "))

                    cursor.execute(comando_SQL, dado)
                    banco.commit()

                    # aqui é pra imprimir a nota fiscal
                    imprimir_nota_fiscal()
                    
                    # aqui já é pra remover os dados da tabela PAGAMENTO
                    print("----- Pagamento -----")
                    print("[1] Pagamento Concluído")
                    print("[2] Pagamento Pendente")
                    confirmacao_pagamento = int(input("Opção escolhida: "))

                    if confirmacao_pagamento == 1:
                        contador_pedidos = buscar_pedidos_cliente(idCli)
                        for i in range(0, contador_pedidos):
                            id = int(input("Informe o id do pedido: "))

                            comando_SQL = "DELETE FROM pagamento WHERE idPedido = %s"
                            dado = (int(id),)
                            cursor.execute(comando_SQL, dado)
                            banco.commit()

                            if i == 0:
                                # alterar o status da mesa ocupada para "Disponível"
                                idMesa_cli = int(input("Informe o id da mesa: "))
                                comando_SQL = "UPDATE mesa SET status = 'Disponível' WHERE idMesa = %s"
                                dado = (int(idMesa_cli),)
                                cursor.execute(comando_SQL, dado)
                                banco.commit()

                            comando_SQL = "DELETE FROM pedido WHERE idPedido = %s"
                            dado = (int(id),)
                            cursor.execute(comando_SQL, dado)
                            banco.commit()

                        os.system('cls')
                        print("Pagamento concluído com sucesso!")
                        print("Tenha uma boa refeição :D")

                    if confirmacao_pagamento == 2:




