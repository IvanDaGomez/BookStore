export default function Balance() {

    // Fetch balance in server
    return (<>
    <h1>Balance</h1>
    <div className="container balanceContainer">
        <div className="numbers">
            <div  >
                <h2>Puedo cobrar:</h2>
                <h3 style={{color: 'var(--using4)'}}>$20000</h3>
            </div>
            <div>
                <h2>Pendiente:</h2>
                <h3>$0</h3>
            </div>
        </div>
        <button>
            Cobrar
        </button>
    </div>
    </>)
}