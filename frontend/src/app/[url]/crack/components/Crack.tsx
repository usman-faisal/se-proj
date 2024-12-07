'use client'
import { useEffect, useState } from 'react';



export default function Crack({url}: {url: string}) {
  const [data, setData] = useState<{image: string, logs: string[]} | null>()
  useEffect(() => {
    (async() => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/url/${url}/crack`, {
        method: 'GET',
      });
      const responseJson = await response.json()
      if(responseJson.success){
        setData(responseJson.data)
      }
    })()
  }, []);
  if(!data) {
    return <p>Loading...</p>
  }
  return (
    <div>
      {data.logs.map((log, idx) => <p key={idx}>{log}</p>)}
      <img src={data.image} />
    </div>
  );
}
