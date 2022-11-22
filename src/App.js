import './App.css';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Mark from 'mark.js';

function App() {
  const [data, setData] = useState(null);
  const [inputVal, setInput] = useState("");
  const [selected, setSelected] = useState([]);
  const [hoveredId, setId] = useState(null)
  const listRef = useRef(null)
  const options = {
    "element": "span",
    "className": "highlight"
  }
  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    let instance = new Mark("div.data");
    instance.unmark(options);
    instance.mark(inputVal, options);
  }, [inputVal, selected.length])

  const fetchData = async () => {
    try {
      const response = await axios.get('http://www.mocky.io/v2/5ba8efb23100007200c2750c', {
        headers: { 'content-type': 'application/json' }
      })
      if (!response) throw new Error()
      setData(response.data)
    }
    catch (e) {
      console.log(e)
    }
  }

  const filterData = (input) => {
    console.log(input);
    let modifiedInput = input.toLowerCase()
    const matchedData = data.filter((val) => {
      if ((val.id.toLowerCase()).includes(modifiedInput)) return val
      else if ((val.name.toLowerCase()).includes(modifiedInput)) return val
      else if ((val.items).includes(modifiedInput)) return val
      else if ((val.address.toLowerCase()).includes(modifiedInput)) return val
      else if ((val.pincode.toLowerCase()).includes(modifiedInput)) return val
      return null
    })

    if (input) setSelected(matchedData)
    else setSelected([])
  }


  return (
    <div className="App">
      <header className="App-header">
        <input type="text"
          className="input"
          placeholder='Search user by ID, address, name, item or pincode'
          value={inputVal}
          onChange={(e) => {
            setInput(e.target.value)
            filterData(e.target.value)
          }} />
        {inputVal && <div className='list' ref={listRef}>
          {selected.length ? selected?.map((val, index) => (
            <div
              key={index}
              id={index}
              className={`data ${index == hoveredId && 'hovered'}`}
              onMouseOver={(e) => {
                setId(e.target.parentNode.id)
              }}
              onMouseOut={() => setId(null)}
              onKeyDown={(e) => console.log(e)}
            >
              <div className='id'>{val.id}</div>
              <div className='name'>{val.name}</div>
              {val.items.includes(inputVal) && <div className='item'>&#x2022; "{inputVal}" found in items</div>}
              <div className='address'>{val.address}</div>
              <div>{val.pincode}</div>
            </div>
          )) :
            <div className='no_data'>No User Found</div>}
        </div>}
      </header>
    </div>
  );
}

export default App;
