const PROTO_PATH = './banco.proto';

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Suggested options for similarity to existing grpc.load behavior
const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition).banco;

// The protoDescriptor object has the full package hierarchy
const servicoBancario = protoDescriptor.ServicoBancario;

const bd = {
    saldo: 1000.0,
    idTransacao: 1,
    trasacoes: [],
};

const server = new grpc.Server();

// implementar o serviço
server.addService(servicoBancario.service, {
    // rpc Extrato (Vazio) returns (ListaDeTransacoes);
    // rpc Saque (DadosOperacao) returns (Transacao);
    // rpc Deposito (DadosOperacao) returns (Transacao);
    // rpc Transferencia (DadosOperacao) returns (Transacao);
    // rpc Compra (DadosOperacao) returns (Transacao);

    Extrato : function(call, callback) {
        callback(null, { transacoes: bd.trasacoes } );
    },


    Saque : function(call, callback) {
        const dadosOperacao = call.request;

        const valor = dadosOperacao.valor;
        const nomeCaixa = dadosOperacao.nomeCaixa;

        if (bd.saldo >= valor) {
            bd.saldo -= valor;
            bd.idTransacao++;

            const transacao = {
                codigo: bd.idTransacao,
                valor: valor,
                descricao: `SAQUE REALIZADO NO TERMINAL ${nomeCaixa}`,
                data: Date.now().toString(),
            };

            bd.trasacoes.push(transacao);

            console.log("Saldo atual: " + bd.saldo);

            callback(null, transacao);
        } else {
            const transacao = {
                codigo: -1,
                valor: 0.0,
                descricao: `TENTATIVA DE SAQUE NO TERMINAL ${nomeCaixa} FRUSTRADA FUÊ!`,
                data: Date.now().toString(),
            };

            console.log("Saldo atual: " + bd.saldo);

            callback(null, transacao);
        }
    },
    Deposito : function(call, callback) {
        const dadosOperacao = call.request;

        const valor = dadosOperacao.valor;
        const nomeCaixa = dadosOperacao.nomeCaixa;

        bd.saldo += valor;
        bd.idTransacao++;

        const transacao = {
            codigo: bd.idTransacao,
            valor: valor,
            descricao: `DEPOSITO REALIZADO NO TERMINAL ${nomeCaixa}`,
            data: Date.now().toString(),
        };

        bd.trasacoes.push(transacao);

        console.log("Saldo atual: " + bd.saldo);

        callback(null, transacao);
    },


    Transferencia : function(call, callback) {
        const dadosOperacao = call.request;

        const valor = dadosOperacao.valor;
        const nomeCaixa = dadosOperacao.nomeCaixa;
        const codigoConta = dadosOperacao.codigoConta;

        if (bd.saldo >= valor) {
            bd.saldo -= valor;
            bd.idTransacao++;

            const transacao = {
                codigo: bd.idTransacao,
                valor: valor,
                descricao: `TRANFERENCIA REALIZADA NO TERMINAL ${nomeCaixa} PARA A CONTA ${codigoConta}`,
                data: Date.now().toString(),
            };

            bd.trasacoes.push(transacao);

            console.log("Saldo atual: " + bd.saldo);

            callback(null, transacao);
        } else {
            const transacao = {
                codigo: -1,
                valor: 0.0,
                descricao: `TENTATIVA DE TRANSFERENCIA NO TERMINAL ${nomeCaixa} PARA A CONTA ${codigoConta} DEU ERRO`,
                data: Date.now().toString(),
            };

            console.log("Saldo atual: " + bd.saldo);

            callback(null, transacao);
        }
    },

    Compra : function(call, callback) {
        const dadosOperacao = call.request;

        const valor = dadosOperacao.valor;
        const nomeEstabelecimento = dadosOperacao.nomeEstabelecimento;

        if (bd.saldo >= valor) {
            bd.saldo -= valor;
            bd.idTransacao++;

            const transacao = {
                codigo: bd.idTransacao,
                valor: valor,
                descricao: `COMPRA REALIZADA NA LOJA: ${nomeEstabelecimento}`,
                data: Date.now().toString(),
            };

            bd.trasacoes.push(transacao);

            console.log("Saldo atual: " + bd.saldo);

            callback(null, transacao);
        } else {
            const transacao = {
                codigo: -1,
                valor: 0.0,
                descricao: `COMPRA NÃO REALIZADA NA LOJA: ${nomeEstabelecimento}. SALDO INSUFICIENTE.`,
                data: Date.now().toString(),
            };

            console.log("Saldo atual: " + bd.saldo);

            callback(null, transacao);
        }
    },
});

server.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), (error, port) => {
    console.log("Servidor gRPC rodando!");
    server.start();
});
