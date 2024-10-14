import { useEffect, useState } from "react"
import { makeCard } from "../assets/makeCard";
// eslint-disable-next-line react/prop-types
export default function Sections({ filter, backgroundColor }){
    /*const [elementSections, setElementSections] = useState()
    useEffect(() => {
        async function fetchData(){
            //www.domainetc/api/filter
            const domainName = "https://localhost:3030"
            const data = await fetch(`${domainName} + /api/filter?filter=${filter}&limit=4`)
            setElementSections(data)
        }
        fetchData()
    }, [filter])*/
    const [elementSections, setElementSections] = useState([])
    const fetchResults = async () => {
        try {
            const response = await fetch("/results.json");
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            
            const info = await response.json(); 
            
            
            if (info !== undefined) {
                setElementSections(info);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };
    useEffect(()=>{
        fetchResults()
        
    },[])
    
    return(  <>
        <div style={{backgroundColor: {backgroundColor}, width:"auto", height:"auto"}}>


        <h1 style={{margin:"0 40px", textAlign:"left"}}>{filter}</h1>
        <div className="sectionsContainer">
            
            {elementSections.slice(0,6).map((element, index) => makeCard(element, index))}
        </div>
        </div>
        </>)
}