import { useEffect } from 'react'
import './App.css'

function App() {
  useEffect(() => {
    const unsubscribe = window.electron.subStatistics((stats) => console.log(stats));
    return unsubscribe;
  }, []);

  return (
    <>

    </>
  )
}

export default App
