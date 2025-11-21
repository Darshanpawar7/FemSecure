import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2 } from 'lucide-react';
import { contactsAPI } from '../services/api';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const response = await contactsAPI.getAll();
      setContacts(response.data);
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !phone.trim() || !phone.match(/^\+\d{7,15}$/)) {
      setError('Please enter a name and a valid phone number (e.g., +1234567890).');
      return;
    }

    try {
      await contactsAPI.create({ name: name.trim(), phone: phone.trim() });
      setName('');
      setPhone('');
      loadContacts();
    } catch (error) {
      setError('Failed to save contact. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await contactsAPI.delete(id);
      loadContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-white border-b border-gray-700 pb-2 max-w-lg mx-auto">
        Emergency Contacts
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-800 rounded-xl shadow-inner max-w-lg mx-auto border border-pink-800">
        <h4 className="text-lg font-semibold text-pink-500 flex items-center">
          <UserPlus className="mr-2" size={20} /> Add Trusted Contact
        </h4>
        <div>
          <label htmlFor="name-input" className="block text-sm font-medium text-gray-300">
            Name
          </label>
          <input
            type="text"
            id="name-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="dark-input mt-1 block w-full rounded-md shadow-sm p-2"
            placeholder="Friend or Family"
            required
          />
        </div>
        <div>
          <label htmlFor="phone-input" className="block text-sm font-medium text-gray-300">
            Phone Number (e.g., +1234567890)
          </label>
          <input
            type="tel"
            id="phone-input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="dark-input mt-1 block w-full rounded-md shadow-sm p-2"
            placeholder="+1 555 123 4567"
            required
            pattern="^\+\d{10,15}$"
          />
        </div>
        {error && <p className="text-red-400 text-sm font-medium">{error}</p>}
        <button
          type="submit"
          className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-pink-600 hover:bg-pink-700 transition duration-150 ease-in-out"
        >
          Save Contact
        </button>
      </form>

      <div className="space-y-3 max-w-lg mx-auto">
        <h4 className="text-lg font-semibold text-gray-300 border-b border-gray-700 pb-1">
          Saved Contacts <span className="text-pink-500">({contacts.length})</span>
        </h4>
        <div className="space-y-3">
          {contacts.length === 0 ? (
            <p className="text-gray-400 italic p-4 bg-gray-800 rounded-lg shadow text-center">
              No contacts added yet.
            </p>
          ) : (
            contacts.map((contact) => (
              <div
                key={contact._id}
                className="flex justify-between items-center p-4 bg-gray-700 rounded-lg shadow border border-pink-700"
              >
                <div>
                  <p className="font-semibold text-white">{contact.name}</p>
                  <p className="text-sm text-pink-400 font-mono">{contact.phone}</p>
                </div>
                <button
                  onClick={() => handleDelete(contact._id)}
                  className="text-red-400 hover:text-red-500 transition duration-150 p-1 rounded-full"
                  aria-label={`Delete contact ${contact.name}`}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Contacts;