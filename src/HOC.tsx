import React, { ComponentType } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { Variables } from '../data/globalVariable';
import axios from 'axios';

//this is the HOC
const withAuth = <P extends object>(Component: ComponentType<P>) => {
    //this is the function that will be called when we want to wrap a component with the HOC
    //props is the props of the component that we want to wrap
  const AuthenticatedComponent = (props: P) => {

    //this is the router
    const router = useRouter();
    //this is the token that we get from the cookie
    const token = Cookies.get('token');
    
    //we check if the window is defined
    if (typeof window !== 'undefined') {
        //call backend to check if the token is valid
        axios.post(Variables.API_URL + '/verifyToken', {
            token: token
        })
        .then(response => {
            if(response.data.valid) {
                return <Component {...props} />;  
            }
            else 
            {
                //if the token is not valid we redirect to the login page which will route to the home page on localhost 3000
                router.push('/');
            
            }
        })
        .catch(error => {
            // Handle error
            console.log(error);
            //if the token is not valid we redirect to the login page
            router.push('/');
        });
    } else {
        //if the window is not defined we redirect to the login page
        router.push('/');
    }

    //if the token is not valid we no not render the component
    return null;
  };

  return AuthenticatedComponent;
};

export default withAuth;
