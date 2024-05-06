import './App.css';
import {useEffect, useState, useRef} from 'react'
import Button from 'react-bootstrap/Button';
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';

function App() {
  const [data, setData] = useState(null);
  const [itemNum, setItemNum] = useState(0);
  const [size, setSize] = useState(null);
  const [cartData, setCartData] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false)

  const target = useRef(null);

  useEffect(() => {
    fetch('https://3sb655pz3a.execute-api.ap-southeast-2.amazonaws.com/live/product')
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => console.error(error));
  }, []);

  

  function clickAdd(itemId, lable){
    if(!size){
      alert("Please select a size")
    }else{
          setItemNum(itemNum+1)   
    const existingItem = cartData.find((each)=>each.id === itemId && each.size === lable)
    existingItem ?  
    setCartData(
      cartData.map((each)=>each.id == existingItem.id && each.size == existingItem.size ? 
        {...each,
        quantity:each.quantity+1
        }
       :
       each
      )
    )
    : 
    setCartData(
      prevCartData => [
        ...prevCartData,
        {
          id: itemId,
          size: lable,
          quantity: 1
        }
      ]
    )
    }

  }



  const selectSize = (id,lable)=> {
    if(size){
      if(size === lable){
        setSize(null)
        document.querySelector(`#size-${id}`).classList.remove("size-btn-active")
      }else{
        setSize(lable)
        const buttons = document.querySelectorAll(".size-btn")
        buttons.forEach((each)=>{
            each.classList.remove("size-btn-active")
        })

        document.querySelector(`#size-${id}`).classList.add("size-btn-active")

      }
    }else{
      setSize(lable)
      document.querySelector(`#size-${id}`).classList.add("size-btn-active")

    }
  }



   function clickCartOpen(){
    setIsCartOpen(!isCartOpen)

    if(isCartOpen){
      document.querySelector('.cartBtn').classList.remove("cart-btn-active")
    }else{
      document.querySelector('.cartBtn').classList.add("cart-btn-active")
    }

   }



    return (
      <div className="App">

        {data ? (
           <div className="detail-section">
          <div className='header'>
            <Button className='cartBtn' ref={target} onClick={clickCartOpen}>My Cart ({itemNum})</Button>
          </div>
  
          <div className="item-container">
            <div className='img-container'>
              <img className='image' src={data.imageURL}/>
            </div>
  
            <div className='info-container'>
              <h3 className='title'>{data.title}</h3>
              <h5 className='price'>${data.price}</h5>
              <p className='desc'>{data.description}</p>
              <div className='size-container'>
                <p>SIZE<span>*</span> <strong>{size}</strong></p>
                {data.sizeOptions.map((each)=>{
                  return(
                  <button className='size-btn' id={`size-${each.id}`} onClick={()=>selectSize(each.id,each.label)}>{each.label}</button>)
                })}
              </div>
              <button className='add' onClick={()=>clickAdd(data.id, size)}>ADD TO CART</button>
              
            </div>
          </div>
        </div>
        ) : (
          <div>Data fetching error</div>
        )}
       
        
           <Overlay target={target.current} show={isCartOpen} placement="bottom">
              {(props) => (
                <Tooltip id="cart-item" {...props}>
                  {itemNum>0 ? 
                    <div> {cartData.map((each)=>{
                      return(
                          <div className='cart-container'>
                            <div className='cart-img-container'>
                              <img src={data.imageURL}/>
                            </div>
                            <div className='cart-info-container'>
                            <p>{data.title}</p>
                            <p>{`${each.quantity} x $${data.price}`}</p>
                            <p>Size: {each.size}</p>
                            </div>
                          </div>
                      )
                    })}
                  </div>: 
                  (<div className='empty-cart'><p>Cart is empty!</p></div>)
                 }
                </Tooltip>
              )}
            </Overlay>
       

       
      </div>
    );
  
  
}

export default App;
