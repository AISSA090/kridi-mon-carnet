export function calculerSoldeClient(clientId, operations) {
    let solde = 0;
    const operationsClient = operations.filter(
        operation => operation.clientId === clientId
    );
    operationsClient.forEach(operation => {
        if (operation.type === "achat") {
            solde += operation.montant;
        } else if (operation.type === "remboursement") {
            solde -= operation.montant;
        }
    });
    return solde;
}

export function calculerCreditDisponible(client, operations) {
    const solde = calculerSoldeClient(client.id, operations);
    const creditDis = client.plafond - solde;
    return creditDis;
}

export function trierOperations(operations) {
    let copyOperation = [...operations];
    copyOperation.sort((a,b) => {
        const difference = new Date(b.date) - new Date(a.date);
        if (difference !== 0) {
            return difference;
        }
        return Number(b.id.slice(2)) - Number(a.id.slice(2));
    });
    return copyOperation;
}