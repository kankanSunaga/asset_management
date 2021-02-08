import React, {useState, useEffect} from 'react';
import History from './interface/history';
import axios from 'axios'
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';



const HistoryView = () => {
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [history, setHistory] = useState<History>()
  const [histories, setHistories] = useState<Array<History>>()
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")


  const URL_BACE = "http://127.0.0.1:3001"

  const handleClose = () => setOpen(false);

  useEffect( () => {
    let fetch = async () => { 
      let res = await axios.get(URL_BACE + "/histories")
      setHistories(res.data)
    }
    fetch()
  },[])

  const saveData = async():Promise<boolean> =>{
    let newHistory = { "price": price, "amount": amount};
    setHistory(newHistory)
    try {
      await axios.post(URL_BACE + "/histories", newHistory);
      return true;
    } catch(e) {
      console.log(e)
      return false;
    } 
  }

  const handleSave = async () => {
    let result = await saveData();
    if (result) {
      let tmpHistories: Array<History>  = histories?.length ? histories : []
      setHistories([...tmpHistories, { "price": price, "amount": amount}])
      setPrice("")
      setAmount("")
      setHistory({ "price": price, "amount": amount})
    }
    modalHelper(result)
  }

  const modalHelper = (result: boolean) => {
    setOpen(true)
    if (result) {
      setMessage("保存が完了しました")
    }　else {
      setMessage("エラーが発生しました")
    }
  }

  const inputArea = () => {
    return (
      <>
        <h5>購入金額（円）</h5>
        <br/>
        <input type="number" onChange={ e => setPrice(e.target.value)} value={price}/>
        <h5>購入量(BTC)</h5>
        <input type="number" onChange={ e => setAmount(e.target.value)} value={amount}/>
        <br/>
        <input type="submit" value="保存" onClick={handleSave}/>
        <Dialog
            open={open}
            keepMounted
            onClose={handleClose}
            aria-labelledby="common-dialog-title"
            aria-describedby="common-dialog-description"
        >
          <DialogContent>
            <h2 id="simple-modal-title">{message}</h2>
            <p id="simple-modal-description">
              モーダルの外をクリックすると閉じます
            </p>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  const displayHistories = () => {    
    const list =  histories?.map((h, i) => {
      <div key={i}>
        <h5>購入金額:{h.price}円分</h5>
        <br/>
        <h5>購入量:{h.amount}BTC</h5>
      </div>
      })
  return <div>{list}</div>
  }

  return (
    <>
      {displayHistories()}
      {inputArea()}
    </>
  )

}

export default HistoryView