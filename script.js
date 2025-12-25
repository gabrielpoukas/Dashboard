
const Transaction = {
    all: JSON.parse(localStorage.getItem("dev.finances:transactions")) || [],

    add(transaction) {
        Transaction.all.push(transaction);
        App.reload();
    },

    remove(index) {
        Transaction.all.splice(index, 1);
        App.reload();
    },

    clearAll(){

 if( confirm("Tem certeza que deseja apagar todas as transações?")) {

Transaction.all = [];
App.reload();

 }


    }
};

const DOM = {
    transactionsContainer: document.querySelector('#tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr');
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
        DOM.transactionsContainer.appendChild(tr);
    },

    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.type === "income" ? "income" : "expense";
        const amount = Utils.formatCurrency(transaction.amount);

        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td>
                <button onclick="Transaction.remove(${index})" style="background:none; border:none; cursor:pointer; color:#ef4444; font-weight:bold;">Excluir</button>
            </td>
        `;
        return html;
    },

    updateBalance() {
        const incomes = Transaction.all
            .filter(t => t.type === "income")
            .reduce((acc, t) => acc + Number(t.amount), 0);
        
        const expenses = Transaction.all
            .filter(t => t.type === "expense")
            .reduce((acc, t) => acc + Number(t.amount), 0);

        const total = incomes - expenses;

        document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(incomes);
        document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(expenses);
        document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(total);
        
        const totalCard = document.querySelector('.card.total');
        totalCard.style.background = total < 0 ? "var(--red)" : "var(--primary)";
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = "";
    }
};

const Utils = {
    formatCurrency(value) {
        return Number(value).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }
};

const Form = {
    description: document.querySelector('#description'),
    amount: document.querySelector('#amount'),
    type: document.querySelector('#type'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            type: Form.type.value
        };
    },

    validateFields() {
        const { description, amount } = Form.getValues();
        if (description.trim() === "" || amount.trim() === "") {
            throw new Error("Por favor, preencha todos os campos");
        }
    },

    clearFields() {
        Form.description.value = "";
        Form.amount.value = "";
    },

    submit(event) {
        event.preventDefault();
        try {
            Form.validateFields();
            const transaction = Form.getValues();
            Transaction.add(transaction);
            Form.clearFields();
        } catch (error) {
            alert(error.message);
        }
    }
};

const Storage = {
    set(transactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions));
    }
};

const App = {
    init() {
        Transaction.all.forEach((t, index) => DOM.addTransaction(t, index));
        DOM.updateBalance();
        Storage.set(Transaction.all);
    },
    reload() {
        DOM.clearTransactions();
        App.init();
    }
};

document.querySelector('#form').addEventListener('submit', Form.submit);
App.init();

document.querySelector('#clear-all').addEventListener('click', Transaction.clearAll);