import { createContext , useReducer } from "react";
import githubReducer from "./GithubReducer";

const GithubContext = createContext();

const GITHUB_URL = process.env.REACT_APP_GITHUB_URL;
// const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;
// ,{
//     headers:{
//         Authorization: `token ${GITHUB_TOKEN}`,
//     },
// }

export const GithubProvider = ({children}) => {
    const initialState = {
        users: [],
        user: {},
        loading: false
    }

    const [state , dispatch] = useReducer(githubReducer , initialState) 

    const searchUsers = async (text) => {
        setLoading()
        clearUsers();
        
        const params = new URLSearchParams({
            q:text
        })
        const response = await fetch(`${GITHUB_URL}/search/users?${params}`)
    
        const {items} = await response.json();
        dispatch({
            type: "GET_USERS",
            payload: items,
        })
    }

    const getUser = async (login) => {
        setLoading()
        
        
        const response = await fetch(`${GITHUB_URL}/users/${login}`)

        if (response.status === 404) {
            window.location = "/notfound"
        } else {
            const data = await response.json();
            dispatch({
                type: "GET_USER",
                payload: data,
            })

        }
    
    }


    //set loading
    const setLoading = ()=> dispatch({type:"SET_LOADING"})

    // Clear results
    const clearUsers = () => dispatch({
        type:"CLEAR_USERS",
        })




    return <GithubContext.Provider value={{
        users: state.users,
        loading: state.loading ,
        user: state.user,
        searchUsers,
        clearUsers,
        getUser,
    }}>
        {children}
    </GithubContext.Provider>

}

export default GithubContext 