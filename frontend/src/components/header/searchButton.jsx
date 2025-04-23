/* eslint-disable react/prop-types */
import { handleSearchInput } from "./handleSearchInput";
import './header.css'

export default function SearchButton ({ submitInputValue, queryInput, setResults }) {
  return (<div className='searchButton'>
              <input
                type='text'
                ref={queryInput}
                autoComplete='off'
                placeholder='Buscar'
                onChange={() => handleSearchInput(queryInput, setResults)}
                onKeyDown={(event) => (event.key === 'Enter') ? submitInputValue() : null}
              />
              <button type='submit' onClick={submitInputValue}>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={20} height={20} fill='none'>
                  <path d='M17.5 17.5L22 22' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
                  <path d='M20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C15.9706 20 20 15.9706 20 11Z' stroke='currentColor' strokeWidth='1.5' strokeLinejoin='round' />
                </svg>
              </button>
            </div>
  )
}