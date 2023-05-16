import axios from "axios";
import { Formik, Form, Field, FormikHelpers, FormikProps } from "formik";
import { Variables } from "../data/globalVariable";
import Cookies from 'js-cookie';
import '../components/admin-form.module.css'
import { useState, useEffect } from "react";
import Pagination from "react-js-pagination";



//


interface Values {
    password: string;
    passwordRepeat : string;
    phoneNumber : string;
    email : string;
    name : string;
    postal : string;
    street : string;
    city : string;
    birthDate : string;
    deviceId : string;
}



export default function AdminForm() 
{
    //this function will create a new user in the database
    const [passwordMatch, setPasswordMatch] = useState(true);

    const createUser = (values: Values) => 
        {
           
                const address = {
                    postal : values.postal,
                    street : values.street,
                    city : values.city,
                }
                const birthDate = new Date(values.birthDate); // Convert birthdate string to Date object
                //converts the date from string to Date format
                const date = Date.now();    
                
                //send the post request to the backend to create a new user in the database
                //send the token in the header to make sure the user is logged in
                axios.post(Variables.API_URL + '/citizen/signup', {
                    //token is saved in the cookie and send in the header
                    headers: {
                        Authorization: `Bearer ${Cookies.get('token')}`,
                    },
                    //send the values from the form to the backend
                    password: values.password,
                    phone : values.phoneNumber,
                    email : values.email,
                    name : values.name,
                    address : address,
                    birthdate : date,
                    deviceId : values.deviceId,
                })
                //if the user is created successfully we get a message
                .then(response => {console.log("eroor comes in response") , console.log(response.data.message)})
                .catch(error => {
                    Cookies.remove('token');
                    window.location.href = '/';
                });
            
        }
        const resetForm = (formikProps: any) => {
            formikProps.resetForm();
        };

        const validate = (values: Values) => {
            const errors: Partial<Values> = {};
            var noError = true;
    
            if (!values.name) {
              errors.name = "Name is required";
              noError = false;
            }
            if (!values.email) {
              errors.email = "Email is required";
              noError = false;
            }
            if(!values.birthDate) {
                errors.birthDate = "Birthdate is required";
                noError = false;
            }
            if (!values.phoneNumber) {
              errors.phoneNumber = "Phone number is required";
                noError = false;
            } else if (!/^[0-9]{8}$/i.test(values.phoneNumber)) {
              errors.phoneNumber = "Invalid phone number";
                noError = false;
            }
          
            if (!values.password) {
              errors.password = "Password is required";
                noError = false;
            }
          
            if (values.password !== values.passwordRepeat) {
              errors.passwordRepeat = "Passwords do not match";
                noError = false;
            }
            if (!values.city || !values.street || !values.postal) {
                errors.city = "Address is required";
                noError = false;
            }
            if(!values.deviceId) {

                errors.deviceId = "Device ID is required";
                noError = false;
            }
            console.log("no error:" + noError)

            if(noError) {
                console.log("no error");
                setPasswordMatch(true);
            } 
            else if(!noError) {
                console.log("there is an error");
                setPasswordMatch(false);
                return errors;
            }
          };


          const onSubmit = (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
            console.log(values);
            var errors = validate(values);
            if (passwordMatch) {
              createUser(values);
            }
            else if(passwordMatch === false)
            {
            setSubmitting(false);
            //show the errors in a pop up window
            console.log("passwordMath:" + passwordMatch);
            alert(JSON.stringify(errors, null, 2));
            }
          };
          




          const [data, setData] = useState([]);
          const [activePage, setActivePage] = useState(1);
          const [itemsPerPage] = useState(20);
          const [searchTerm, setSearchTerm] = useState('');


          useEffect(() => {
            fetchData();
          }, []);

          const fetchData = async () => {
            

            const response = await axios.get(Variables.API_URL + '/citizen',{
              headers: {
                Authorization: `Bearer ${Cookies.get('token')}`,
              }
            }).catch((error) => {
              /*if there is an error go to the login page*/ 
              Cookies.remove('token');
              window.location.href = '/';  
            });



            console.log(response.data.citizens);

            setData(response.data.citizens);
            
          };

          const handlePageChange = (pageNumber:any) => {
            setActivePage(pageNumber);
          };

          const handleSearch = (event:any) => {
            setSearchTerm(event.target.value);
            setActivePage(1); // reset active page when search term changes
          };


          const indexOfLastItem = activePage * itemsPerPage;
          const indexOfFirstItem = indexOfLastItem - itemsPerPage;
          let currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

          if (searchTerm) {
            // filter currentItems array by search term
            currentItems = currentItems.filter(item => item.citizen.toString().includes(searchTerm));
          }
          
    return (
        <div>
                
            <div>
                <Formik
                    initialValues={{
                        password: "",
                        passwordRepeat: "",
                        phoneNumber: "",
                        email: "",
                        name: "",
                        city: "",
                        street: "",
                        postal: "",
                        birthDate: "",
                        deviceId: "",
                    }}
                    
                    onSubmit={onSubmit}
                    
                    
                >
                {(formikProps) => (
                <div style={{position: 'absolute', top: '8%' , left: '0%' , padding: '2%px', background: '#2da9cd', height: '100%', width: '15%'}}>

                    <Form>
                        

                        <div className="mb-2" style={{padding: '2%'}}>
                            <Field className="form-control" id="name" name="name" placeholder="Name" />
                        </div>

                        <div className="mb-2" style={{padding: '2%'}}>
                            <Field className="form-control" id="password" name="password" placeholder="Password" type="password" />
                        </div>

                        <div className="mb-2" style={{padding: '2%'}}>
                            <Field className="form-control" id="passwordRepeat" name="passwordRepeat" placeholder="Repeat Password" type="password" />
                        </div>

                        <div className="mb-2" style={{padding: '2%'}}>
                            <Field className="form-control" id="email" name="email" placeholder="Email" />
                        </div>

                        <div className="mb-2" style={{padding: '2%'}}>
                            <Field className="form-control" id="phoneNumber" name="phoneNumber" placeholder="Phone Number" />
                        </div>

                        <div className="mb-2" style={{padding: '2%'}}>
                            {/* Birthdate input */}
                            <Field className="form-control" id="birthDate" name="birthDate" type="date" />
                        </div>

                        <div className="mb-2" style={{padding: '2%'}}>
                            <Field className="form-control" id="city" name="city" placeholder="City" />
                        </div>

                        <div className="mb-2" style={{padding: '2%'}}>
                            <Field className="form-control" id="street" name="street" placeholder="Street" />
                        </div>

                        <div className="mb-2" style={{padding: '2%'}}>
                            <Field className="form-control" id="postal" name="postal" placeholder="Postal" />
                        </div>

                        <div className="mb-2" style={{padding: '2%'}}>
                            <Field className="form-control" id="deviceId" name="deviceId" placeholder="Device ID" />
                        </div>

                        <div>
                            <button type="submit" className="btn btn-primary" style={{ fontSize: '70%', padding: '5% 10%', marginRight: '5%', width: '40%' , marginLeft: '5%'}}  >Create User</button>
                            <button type="button" className="btn btn-primary" style={{ fontSize: '70%', padding: '5% 10%', width: '40%' }} onClick={() => resetForm(formikProps)}>Clear Fields</button>
                        </div>


                    </Form>
                </div>
                )}
                </Formik>
            </div>

            <div className="mb-2" style={{position: 'absolute', top: '0%', left: '0%', width: '100%',height: '8%',  background: '#1E88E4'}}>
                

                

                      <div className="w-full h-full" style={{position: 'absolute' , top: '4%', left: '2%',}}>
                          <p style={{color: 'white', fontSize: '50px'}} className="text-base md:text-lg lg:text-4xl">Create user</p>
                      </div>
            

                    <div style={{position: 'absolute', top: '15px', right: '10px', padding: '10px'}}>
                        <button type="button" className="btn btn-primary" style={{ fontSize: '14px', padding: '5px 10px', marginRight: '5px', width: '100px'}} onClick={() => {
                        window.location.href = '/showData';
                        }}>data</button>
                            
                        <button type="button" className="btn btn-primary" style={{fontSize: '14px', padding: '5px 10px',width: '100px'}} onClick={() => {
                        Cookies.remove('token');
                        window.location.href = '/';
                        }}>Log out</button>
                    </div>
               
            </div>
              
                  
            <div style={{position: 'absolute', left: '15%', top: '4%', width: '100%'}}>
                    {/* Render list items */}
                    <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                          gap: '10px',
                          margin: '40px auto',
                          maxWidth: '95%',
                        }}
                      >
                        {currentItems.map((item, index) => {
                          const birthDate = new Date(item.birthdate);
                          return (
                            <div

                              key={index}
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '20px',
                                background: '#fff',
                                borderRadius: '10px',
                                boxShadow: '0 0 10px rgba(0, 0, 0, 0.15)',
                              }}
                            >
                              <p style={{fontSize: '20px', fontWeight: 'bold', color: '#1E88E4'}}>{item.citizen}</p>
                              <p style={{fontSize: '20px', fontWeight: 'bold', color: '#1E88E4'}}>{item.name}</p>
                              <p style={{fontSize: '20px', fontWeight: 'bold', color: '#1E88E4'}}>{item.email}</p>
                              <p style={{fontSize: '20px', fontWeight: 'bold', color: '#1E88E4'}}>{item.phone}</p>
                              <p style={{fontSize: '20px', fontWeight: 'bold', color: '#1E88E4'}}>{birthDate.toISOString}</p>
                              <p style={{fontSize: '20px', fontWeight: 'bold', color: '#1E88E4'}}>{item.address.city}</p>
                              <p style={{fontSize: '20px', fontWeight: 'bold', color: '#1E88E4'}}>{item.address.street}</p>
                              <p style={{fontSize: '20px', fontWeight: 'bold', color: '#1E88E4'}}>{item.address.postal}</p>
                              <p style={{fontSize: '20px', fontWeight: 'bold', color: '#1E88E4'}}>{item.deviceId}</p>
                              

                            </div>)

                        }
                        
                        )}
                        
                       
                        
                      </div>
      
        
                      <div style={{position: 'absolute', bottom: '-50px', left: '50%', transform: 'translateX(-50%)'}}>
                      {/* Render pagination component */}
                              <Pagination
                                activePage={activePage}
                                itemsCountPerPage={itemsPerPage}
                                totalItemsCount={data.length}
                                pageRangeDisplayed={5}
                                onChange={handlePageChange}
                                itemClass="page-item"
                                linkClass="page-link"
                              />
                      </div>
                  </div>
        </div>
        
    )
}
   
