import axios from "axios";
import { Formik, Form, Field, FormikHelpers, FormikProps } from "formik";
import { Variables } from "../data/globalVariable";
import Cookies from 'js-cookie';
import '../components/admin-form.module.css'
import { useState, useEffect } from "react";
import Pagination from "react-js-pagination";
import styles from '/components/stdColors.module.css'




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
                .then(response => {fetchData(),console.log("eroor comes in response") , console.log(response.data.message), fetchData()})
                .catch(error => {
           
                });
            
        }
        const resetForm = (formikProps: any) => {
            formikProps.resetForm();
            //reset index selected
            setSelectedItemIndex(null);
            setSelectedItem(null);
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

          const deleteUser = (id: string) => {
            axios.delete(Variables.API_URL + '/citizen/' + id, {
              headers: {
                Authorization: `Bearer ${Cookies.get('token')}`,
              }
            }).then(response => {
              console.log(response.data.message);
              fetchData();
            }).catch(error => {
             
            });
          };

         
            


          const updateUser = (values: any) => {


            const updateUserData = [
              {propName: "name", value: values.name},
              {propName: "email", value: values.email},
              {propName: "phone", value: values.phoneNumber},
              
              {propName: "birthdate", value: values.birthDate},
              {propName: "deviceId", value: values.deviceId},

              //addres is an object
              {propName: "address", value: {
                postal : values.postal,
                street : values.street,
                city : values.city,
              }},

              //password update only if a new password is entered
              //if the password is not entered, the password will not be updated
              ...(values.password !== "" ? [{ propName: "password", value: values.password }] : [])
              




            ]

            axios.patch(Variables.API_URL + '/citizen/'+ values.id, updateUserData, {
              headers: {
                Authorization: `Bearer ${Cookies.get('token')}`,
              },
           
             
            
            }).then(response => {
              console.log(response.data.message);
              fetchData();
            }
            ).catch(error => {
              console.log(error);
            });

          };


          function getBrowserResolutionWidth() {
            if (typeof window !== 'undefined') {
              return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            }
            return null;
          }

          var browserWidth = getBrowserResolutionWidth();

          

         



          const [data, setData] = useState([]);
          const [activePage, setActivePage] = useState(1);
          
          const [searchTerm, setSearchTerm] = useState('');
          const [formikProps, setFormikProps] = useState(null);
          const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
          const [selectedItem, setSelectedItem] = useState<any | null>(null);
          const [limit , setLimit] = useState(10);
          const [itemsPerPage] = useState(limit);

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

        
          const handleItemClick = (index:number ,item:any, values : FormikHelpers<Values> ) => {
            //fill in the form with the data of the user that is clicked
            console.log(item);
            values.setFieldValue('name', item.name);
            values.setFieldValue('email', item.email);
            values.setFieldValue('phoneNumber', item.phone);
            values.setFieldValue('birthDate', item.birthdate);
            values.setFieldValue('deviceId', item.deviceId);
            values.setFieldValue('city', item.address.city);
            values.setFieldValue('street', item.address.street);
            values.setFieldValue('postal', item.address.postal);
            values.setFieldValue('password', "");
            values.setFieldValue('passwordRepeat', "");
            values.setFieldValue('id', item._id);
            
            setSelectedItemIndex(index);
            setSelectedItem(values);
            
          };


          const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
            const newLimit = parseInt(event.target.value, 10);
            setLimit(newLimit);
            setActivePage(1);
        
          };
            
        

            

        
         

          
    return (
    <div>

<div className={styles.color_topbar} style={{ position: 'absolute', top: '0%', left: '0%', width: '100%', height: 'auto' }}>
            <h1 style={{ textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '3vw' }}>Night Assist</h1>
              <h3 style={{ textAlign: 'center', color: 'white', fontSize: '2vw' }}>Your Guide through the night</h3>

              <div style={{position: 'absolute', top: '50%',transform: 'translateY(-50%)', right: '10px', padding: '10px'}}>


                      <button type="button" className="btn btn-primary" style={{ fontSize: '1vw',  marginRight: '0.2rem'}} onClick={() => {
                      window.location.href = '/accidentPage';
                      }}>Accidents</button>


                      <button type="button" className="btn btn-primary" style={{ fontSize: '1vw',  marginRight: '0.2rem'}}  onClick={() => {
                      window.location.href = '/citizen';
                      }}>Citizen</button>

                      <button type="button" className="btn btn-primary" style={{ fontSize: '1vw', marginRight: '0.2rem'}}  onClick={() => {
                      window.location.href = '/timestamps';
                      }}>Timestaps</button>

                    <button type="button" className="btn btn-primary" style={{ fontSize: '1vw',}}  onClick={() => {
                      Cookies.remove('token');
                      window.location.href = '/';
                    }}>Log out</button>
                </div>

                 <select className="btn"id="limitDropdown" style={{position: 'absolute', top: '50%',transform: 'translateY(-50%)', fontSize:'1.5vw', color:'white'}} value={limit} onChange={handleLimitChange}>

              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="50">50</option>
            </select>
          </div>

          <div className="mb-2" style={{position:'absolute', top:'calc(12% + 10px' , left: '0%', width: '100%', height: '92%'}}>
                      
            
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
                              id: ""
                          }}
                          onSubmit={onSubmit}
                      >
                      {(formikProps) => (
                      <Form>

                      <div style={{position: 'absolute', top: '0%' , left: '0%', height: '100%', width: '15%'}}>
                              

                              <div className="mb-2" style={{padding: '2%' ,marginTop: '4%'}}>
                                  <Field className="form-control" id="name" name="name" placeholder="Name" style={{fontSize:'1vw'}} />
                              </div>

                              <div className="mb-2" style={{padding: '2%'}}>
                                  <Field className="form-control" id="password" name="password" placeholder="Password" type="password" style={{fontSize:'1vw'}} />
                              </div>

                              <div className="mb-2" style={{padding: '2%'}}>
                                  <Field className="form-control" id="passwordRepeat" name="passwordRepeat" placeholder="Repeat Password" type="password" style={{fontSize:'1vw'}}/>
                              </div>

                              <div className="mb-2" style={{padding: '2%'}}>
                                  <Field className="form-control" id="email" name="email" placeholder="Email" style={{fontSize:'1vw'}}/>
                              </div>

                              <div className="mb-2" style={{padding: '2%'}}>
                                  <Field className="form-control" id="phoneNumber" name="phoneNumber" placeholder="Phone Number" style={{fontSize:'1vw'}} />
                              </div>

                              <div className="mb-2" style={{padding: '2%'}}>
                                  {/* Birthdate input */}
                                  <Field className="form-control" id="birthDate" name="birthDate" type="date" style={{fontSize:'1vw'}}/>
                              </div>

                              <div className="mb-2" style={{padding: '2%'}}>
                                  <Field className="form-control" id="city" name="city" placeholder="City" style={{fontSize:'1vw'}}/>
                              </div>

                              <div className="mb-2" style={{padding: '2%'}}>
                                  <Field className="form-control" id="street" name="street" placeholder="Street" style={{fontSize:'1vw'}}/>
                              </div>

                              <div className="mb-2" style={{padding: '2%'}}>
                                  <Field className="form-control" id="postal" name="postal" placeholder="Postal" style={{fontSize:'1vw'}}/>
                              </div>

                              <div className="mb-2" style={{padding: '2%'}}>
                                  <Field className="form-control" id="deviceId" name="deviceId" placeholder="Device ID" style={{fontSize:'1vw'}}/>
                              </div>

                              <div className="mb-2" style={{padding: '2%'}}>
                                  <Field className="form-control" id="id" name="id" placeholder="ID" style={{fontSize:'1vw'}}/>
                              </div>

                              <div>
                                  <button type="submit" className="btn btn-primary" style={{ fontSize: '1vw', padding: '5% 10%', marginRight: '5%', width: '40%' , marginLeft: '5%'}}  >Create User</button>
                                  <button type="button" className="btn btn-primary" style={{ fontSize: '1vw', padding: '5% 10%', width: '40%' }} onClick={() => resetForm(formikProps)}>Clear Fields</button>
                              </div>
                              <div>
                                  <button type="button" className="btn btn-primary" style={{ fontSize: '1vw', padding: '5% 10%', width: '40%', marginRight: '5%', marginLeft: '5%' , marginTop: '5%'}} onClick={() => {deleteUser(formikProps.values.id); resetForm(formikProps);}}>Delete User</button>
                                  <button type="button"  className="btn btn-primary" style={{ fontSize: '1vw', padding: '5% 10%', width: '40%', marginTop: '5%'}} onClick={() => {updateUser(formikProps.values); resetForm(formikProps);}}>Update User</button>
                              </div>
                      </div>
                        

            {/* Data objects */}
            <div style={{ position: 'absolute', top: '0%', left: '15%', height: '85%', width: '85%' }}>
            <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fit, minmax(${28}ch, 1fr))`,
          gap: '10px',
          margin: '2%',
          maxWidth: '95%',
          overflow: 'auto',
          fontSize: '1.2rem',
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
                        padding: '2%',
                        borderRadius: '10px',
                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.15)',
                        cursor: 'pointer',
                        background: selectedItemIndex === index ? '#dae1e3' : '#fff',
                        
                        minWidth: 'fit-content', // Set the minWidth property to fit the content width
                      }}
                      onClick={() => { handleItemClick(index, item, formikProps), console.log("Selected" + selectedItem + "" + index) }}
                    >
                      {/* Render item details */}

                      <p style={{ fontSize: '1.2rem', margin: '0px', whiteSpace: 'nowrap'}}> Name: {item.name}</p>
                      <p style={{ fontSize: '1.2rem', margin: '0px', whiteSpace: 'nowrap'}}> Email: {item.email}</p>
                      <p style={{ fontSize: '1.2rem', margin: '0px', whiteSpace: 'nowrap'}}> Phone Number: {item.phone}</p>
                      <p style={{ fontSize: '1.2rem', margin: '0px', whiteSpace: 'nowrap'}}> Birthdate: {birthDate.toLocaleDateString()}</p>
                      <p style={{ fontSize: '1.2rem', margin: '0px', whiteSpace: 'nowrap'}}> City: {item.address.city}</p>
                      <p style={{ fontSize: '1.2rem', margin: '0px', whiteSpace: 'nowrap'}}> Street: {item.address.street}</p>
                      <p style={{ fontSize: '1.2rem', margin: '0px', whiteSpace: 'nowrap'}}> Postal: {item.address.postal}</p>
                      <p style={{ fontSize: '1.2rem', margin: '0px', whiteSpace: 'nowrap'}}> Device ID: {item.deviceId}</p>
                      <p style={{ fontSize: '1.2rem', margin: '0px', whiteSpace: 'nowrap'}}> ID: {item._id}</p>
                    

                  
                    </div>
                  );
                })}
              </div>
              {/* Pagination component */}
              <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
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
          </Form>
        )}
      </Formik>
    </div>
  </div>

  );
}
