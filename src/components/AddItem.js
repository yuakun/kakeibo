import React from 'react';
import { styled } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const AddButton = styled(Button)({
  background: '#87CEEB',
  border: 0,
  borderRadius: 3,
  color: 'white',
  height: 48,
  width: '250px',
  textAlign: 'centner',
  fontSize: '1.8rem',
  margin: '10px 0 20px 0',  
  '&:hover': {
    backgroundColor: '#3fb8e7',
  },
});

export const AddItem = ({ addIncome, addExpense, inputText, setInputText, inputAmount, setInputAmount, type, setType, selectedMonth, thisMonth}) => {

  const typeHandler = (e) => {
    setType(e.target.value);
  }

  const inputTextHandler = (e) => {
    setInputText(e.target.value);
  };

  const inputAmountHandler = (e) => {
    setInputAmount(parseInt(e.target.value));
  }

  const reset = () => {
    setInputText("");
    setInputAmount("");
  }

  const submitItemHandler = (e) => {
    e.preventDefault();
    if (inputText == '' || inputAmount == '0' || !(inputAmount > 0 && inputAmount <= 10000000)) {
      alert ('正しい内容を入力してください')
    } else if ( type === 'inc') {
      addIncome(inputText, inputAmount) 
      reset();
    } else if ( type === 'exp' ) {
      addExpense(inputText, inputAmount)
      reset();
    }
  }

  const thisMonthForm = () => {
    return (
      <form className="add-form">
        <select onChange={typeHandler}>
          <option value="inc">+</option>
          <option value="exp">-</option>
        </select>
        <div className="add-text">
          <label>内容</label>
          <input type="text" value={inputText} onChange={inputTextHandler}/>
        </div>
        <div className="add-amount">
          <label>金額</label>
          <input type="number" value={inputAmount} onChange={inputAmountHandler}/>
          <div>円</div>
        </div>
        <div className="add-btn">
        <AddButton type="submit" onClick={submitItemHandler}>追加</AddButton>
        </div>
      </form> 
    )
  }

  const otherMonthForm = () => {
    return (
      <form></form>
    )
  }
        
  return (
    <>
    {thisMonth === selectedMonth ? thisMonthForm() : otherMonthForm()}
    </>
  )
  
} 
