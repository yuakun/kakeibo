import React, { useState, useContext, useEffect } from 'react';
import { db } from "../firebase/Firebase";
import { Header } from './Header';
import { Balance } from './Balance';
import { IncomeExpense } from './IncomeExpense';
import { AddItem } from './AddItem';
import { ItemsList } from './ItemsList';
import { AuthContext } from '../auth/AuthProvider';
import { totalCalc } from './TotalIncome';
import firebase from "firebase/app";
import "firebase/firestore";
import axios from 'axios';

function Home () {

  const [inputText, setInputText] = useState("");
  const [inputAmount, setInputAmount] = useState(0);
  const [incomeItems, setIncomeItems] = useState([]);
  const [expenseItems, setExpenseItems] = useState([]);
  const [type, setType] = useState("inc")
  const [date, setDate] = useState(new Date());

  const { currentUser } = useContext(AuthContext)

  useEffect (() => {
    getIncomeData();
    getExpenseData();
  }, []);

  useEffect(() => {
    getIncomeData();
    getExpenseData();
  }, [date]);

  //for Header
  const setPrevMonth = () => {
    const year = date.getFullYear();
    const month = date.getMonth()-1;
    const day = date.getDate();
    setDate(new Date(year, month, day));
  }

  const setNextMonth = () => {
    const year = date.getFullYear();
    const month = date.getMonth()+1;
    const day = date.getDate();
    setDate(new Date(year, month, day));
  }

  //get first date of the month
  const startOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  //get last date of this month
  const endOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  //operate add form and income/expense list
  const selectedMonth = date.getMonth() + 1;
  const today = new Date();
  const thisMonth = today.getMonth() + 1;

  //firebase IncomeData
  const getIncomeData = () => {
    /*
    const incomeData = db.collection('incomeItems')
    incomeData.where('uid', '==', currentUser.uid).orderBy('date').startAt(startOfMonth(date)).endAt(endOfMonth(date)).onSnapshot(query => {
      const incomeItems = []
      query.forEach(doc => incomeItems.push({...doc.data(), docId: doc.id}))
      setIncomeItems(incomeItems);
    })
    */
    axios.get('http://127.0.0.1:8080/getIncome')
    .then(response => {
      if (response.status != 200) {
        throw new Error('レスポンスエラー')
      } else {
        var resultProducts = response.data
        const incomeItems = []
        for(var ii in resultProducts){
          incomeItems.push({text: resultProducts[ii].ProductName, amount: parseInt(resultProducts[ii].Amount) })
        }

        setIncomeItems(incomeItems);
      }
    })
  }

  const addIncome = (text, amount) => {
   // 商品情報を登録する
    // サーバへ送信するパラメータ
    const params = new URLSearchParams();
    const docId = Math.random().toString(32).substring(2);
    //const date = new Date();
    params.append('ID', docId)
    params.append('ProductName', text)
    params.append('Amount', amount)
    //params.append('Date', date)

    axios.post('http://127.0.0.1:8080/addProduct', params)
    .then(response => {
      setIncomeItems([
        ...incomeItems, {text: inputText, amount: inputAmount, docId: docId }
      ]); 
    })

    axios.defaults.withCredentials = true;
  }
  
  const deleteIncome = (docId) => {
    //db.collection('incomeItems').doc(docId).delete()
    const params = new URLSearchParams();
    params.append('ID', docId)

    axios.post('http://127.0.0.1:8080/delete', params)
    .then(response => {
      getIncomeData()
    })
  }
  

  //firebase Expense data
  const getExpenseData = () => {
    /*
    const expenseData = db.collection('expenseItems')
    expenseData.where('uid', '==', currentUser.uid).orderBy('date').startAt(startOfMonth(date)).endAt(endOfMonth(date)).onSnapshot(query => {
      const expenseItems = []
      query.forEach(doc => expenseItems.push({...doc.data(), docId: doc.id}))
      setExpenseItems(expenseItems);
    })
    */
    axios.get('http://127.0.0.1:8080/getExpense')
    .then(response => {
      if (response.status != 200) {
        throw new Error('レスポンスエラー')
      } else {
        var resultProducts = response.data
        const expenseItems = []
        for(var ii in resultProducts){
          expenseItems.push({text: resultProducts[ii].ProductName, amount: parseInt(resultProducts[ii].Amount) })
        }

        setExpenseItems(expenseItems);
      }
    })
  }

  const addExpense = (text, amount) => {
   // 商品情報を登録する
    // サーバへ送信するパラメータ
    const params = new URLSearchParams();
    const docId = Math.random().toString(32).substring(2);
    params.append('ID', docId)
    params.append('ProductName', text)
    params.append('Amount', amount)

    axios.post('http://127.0.0.1:8080/expProduct', params)
    .then(response => {
      setExpenseItems([
        ...expenseItems, {text: inputText, amount: inputAmount, docId: docId }
      ]); 
    })
  }

  const deleteExpense = (docId) => {
    db.collection('expenseItems').doc(docId).delete()
  }

  // calculate % and show total
  const incomeTotal = totalCalc(incomeItems);

  return (
    <div className="container">
      <div className="top">
        <Header 
          date={date}
          setPrevMonth={setPrevMonth}
          setNextMonth={setNextMonth}
        />
        <Balance 
          incomeTotal={incomeTotal}
          expenseItems={expenseItems}
        />
        <IncomeExpense 
          incomeTotal={incomeTotal}
          expenseItems={expenseItems}
        />
      </div>
        <AddItem
          addIncome={addIncome}
          addExpense={addExpense}
          inputText={inputText}
          setInputText={setInputText}
          inputAmount={inputAmount}
          setInputAmount={setInputAmount}
          type={type}
          setType={setType}
          selectedMonth={selectedMonth}
          thisMonth={thisMonth}
        />
        <ItemsList 
          deleteIncome={deleteIncome}
          deleteExpense={deleteExpense}
          incomeTotal={incomeTotal}
          incomeItems={incomeItems} 
          expenseItems={expenseItems}
          selectedMonth={selectedMonth}
          thisMonth={thisMonth}
        />
    </div>
  )
}

export default Home;
