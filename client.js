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

const client = new protoDescriptor.ServicoBancario("127.0.0.1:50051", grpc.credentials.createInsecure());

// client.Saque({
//     valor: 100.0,
//     nomeCaixa: "CAIXA SD",
// }, (err, response) => {
//     const transacao = response;

//     if (transacao.codigo == -1) {
//         console.log("Operação de saque falhou!");
//     } else {
//         console.log("Operação de saque realizada com sucesso!");
//     }

//     console.log(transacao.codigo);
//     console.log(transacao.valor);
//     console.log(transacao.descricao);
//     console.log(transacao.data);

//     client.Saque({
//         valor: 50.0,
//         nomeCaixa: "CAIXA SD",
//     }, (err, response) => {
//         const transacao = response;
    
//         if (transacao.codigo == -1) {
//             console.log("Operação de saque falhou!");
//         } else {
//             console.log("Operação de saque realizada com sucesso!");
//         }
    
//         console.log(transacao.codigo);
//         console.log(transacao.valor);
//         console.log(transacao.descricao);
//         console.log(transacao.data);
    
//     });

// });

// client.Deposito({
//     valor: 70.0,
//     nomeCaixa: "CAIXA SD",
// }, (err, response) => {
//     const transacao = response;

//     console.log("Operação de depósito realizada com sucesso!");

//     console.log(transacao.codigo);
//     console.log(transacao.valor);
//     console.log(transacao.descricao);
//     console.log(transacao.data);
// });

client.Extrato({}, (err, response) => {
    const listaDeTransacoes = response.transacoes;

    console.log("EXTRATO DO BANCO SD S.A.\n");

    for (i = 0; i < listaDeTransacoes.length; i++) {
        const transacao = listaDeTransacoes[i];

        console.log(`${transacao.codigo}   ${transacao.descricao}\t${transacao.data}  R\$ ${transacao.valor}`);
    }

    console.log("\n------ FIM DO EXTRATO");
})

// client.Transferencia({
//     valor: 100.0,
//     nomeCaixa: "CAIXA SD",
//     codigoConta: 210,
// }, (err, response) => {
//     const transacao = response;

//     console.log("Operação de tranferencia realizada com sucesso!");

//     console.log(transacao.codigo);
//     console.log(transacao.valor);
//     console.log(transacao.descricao);
//     console.log(transacao.data);
// });

// client.Compra({
//     valor: 150.0,
//     nomeEstabelecimento: "AMERICANAS"

// }, (err, response) => {
//     const transacao = response;

//     console.log(`Compra realizada com sucesso no valor de ${transacao.valor}!`);

//     console.log(transacao.codigo);
//     console.log(transacao.valor);
//     console.log(transacao.descricao);
//     console.log(transacao.data);
// });