import React, {useState, useEffect} from 'react';
import './App.css';

function App() {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({name:'', email_address:'', age:''});
  const [update, setUpdate] = useState({});
  const [hidden, setHidden] = useState(true);


  useEffect(()=>{
    getData()
  }, [])

  function getData(){
    fetch('http://localhost:3030/contacts')
      .then(res => res.json())
      .then(res => setContacts([...res]))
  }

  function deleteContact(id){
    fetch(`http://localhost:3030/contact/${id}`, {
      method: 'DELETE',
      headers:{
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(() => getData())
  }

  function addItem(){
    fetch(`http://localhost:3030/contacts`, {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newContact),
    })
      .then(res => res.json())
      .then(() => {getData(); setNewContact({name:'', email_address:'', age:''});
    })

    setHidden(!hidden)
  }

  function completeUpdate(contact){
    fetch(`http://localhost:3030/contacts`, {
      method: 'PUT',
      headers:{
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contact),
    })
      .then(res => res.json())
      .then(() => getData())
      .then(() => updateContact())
  }

  function updateContact(id){
    const newUpdate = {...update};

    for(let contact in contacts){
      newUpdate[contacts[contact].id] = false;
    }

    setUpdate(newUpdate);
    if(id !== undefined){setUpdate({...newUpdate, [id]: !update[id]})};
  }

  function updateContactInfo(contact, e){
    contact[e.target.getAttribute('field')] = e.target.value;
    for(let i in contacts){
      if(contact.id === contacts[i].id){
        let updatedContacts = [...contacts];
        updatedContacts[i] = contact;
        setContacts([...updatedContacts])
      }
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        {contacts.map((contact) => { 
          return (!update[contact.id]?          
            <div className='contactCard' key={contact.id}>
              <h3>{contact.name}</h3>
              <p>{contact.email_address}</p> 
              <p>{contact.age}</p>
              <button onClick={() => updateContact(contact.id)}>Update</button>
              <button onClick={() => deleteContact(contact.id)}>Delete</button>
            </div> 
            :
            <div className='contactCard' key={contact.id}>
              <input defaultValue={contact.name} field='name' placeholder='name' onChange={(e) => updateContactInfo(contact, e)}/>
              <input defaultValue={contact.email_address} field='email_address' placeholder='email' onChange={(e) => updateContactInfo(contact, e)}/>
              <input defaultValue={contact.age} field='age' placeholder='age' onChange={(e) => updateContactInfo(contact, e)}/>
              <button onClick={() => {updateContact(contact.id); getData()}}>Cancel</button>
              <button onClick={() => completeUpdate(contact)}>Update</button>
            </div>
          )
        })}
      {hidden ?
        <button onClick={() => setHidden(!hidden)}>Add New Item</button>:
        <div className='contactCard' >
          <h3>Name: <input onChange={(e)=>setNewContact({...newContact, name: e.target.value})} value={newContact.name} placeholder='name'/></h3>
          <br/>
          <p>Email: <input onChange={(e)=>setNewContact({...newContact, email_address: e.target.value})} value={newContact.email_address} placeholder='email'/></p>
          <br/>
          <p>Age: <input onChange={(e)=>setNewContact({...newContact, age: e.target.value})} value={newContact.age} placeholder='age'/></p>
          <br/>
          <button onClick={()=>addItem()}>Submit</button>
      </div>}
      </header>
    </div>
  );
}

export default App;