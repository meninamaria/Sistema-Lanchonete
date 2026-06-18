from PyQt5 import uic,QtWidgets
import connector 

def funcaoPrincipal():
    linha1 = tela01.lineEdit.text()
    linha2 = tela01.lineEdit_2.text()

    print("Codigo:", linha1)
    print("Descricao:", linha2)

app=QtWidgets.QApplication([])
tela01=uic.loadUi("tela01.ui")
tela01.pushButton.clicked.connect(funcaoPrincipal)

tela01.show()
app.exec()

#criação da primeira tabela pedido
create table pedido (
    idPedido INT NOT NULL AUTO_INCREMENT,
    data VARCHAR (20),
    total DOUBLE,
    idCliente INT,
    idFunc INT,
    idMesa INT,
    PRIMARY key (idPedido),
    FOREIGN Key (idCliente) REFERENCES cliente(idCliente),
    FOREIGN Key (idFunc) REFERENCES funcionario(idFunc),
    FOREIGN Key (idMesa) REFERENCES mesa(idMesa)
);

#tabela cliente
create table cliente(
    idCliente INT NOT NULL AUTO_INCREMENT,
    telefone VARCHAR (20),
    cpf VARCHAR (20),
    nome VARCHAR(50),
    PRIMARY key (idCliente)
);

#tabela funcionario
create table funcionario(
    idFunc INT NOT NULL AUTO_INCREMENT,
    salario DOUBLE,
    cpf VARCHAR(20),
    nome VARCHAR(50),
    PRIMARY key (idFunc)
);

#tabela mesa
create table mesa(
    idMesa INT NOT NULL AUTO_INCREMENT,
    status VARCHAR (20),
    numero INT,
    capacidade INT,
    tipo VARCHAR(20), 
    turno VARCHAR(20),
    especialidade VARCHAR(50),
    PRIMARY key (idMesa)
);

#tabela produto
create table produto(
    idProduto INT NOT NULL AUTO_INCREMENT,
    nome VARCHAR (50),
    preco DOUBLE,
    PRIMARY key (idProduto),
    FOREING key (idCategoria) REFERENCES categoria(idCategoria)
);
#tabela categoria
create table categoria(
    idCategoria INT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(50),
    PRIMARY key (idCategoria)
);

#tabela pagamento
create table pagamento(
    idPagamento INT NOT NULL AUTO_INCREMENT,
    forma VARCHAR(20),
    valor DOUBLE,
    PRIMARY key(idPagamento),
    FOREIGN Key (idPedido) REFERENCES pedido(idPedido)
);

#tabela itemPedido
create table itemPedido(
    subTotal DOUBLE,
    quantidade INT,
    idPedido INT,
    idProduto INT,   
    FOREIGN KEY (idPedido) REFERENCES pedido(idPedido),
    FOREIGN KEY (idProduto) REFERENCES produto(idProduto)
);

