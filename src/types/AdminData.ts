export interface Admin_shop{
  userName: string   
  phone  :string      
  email  :string      
  password  :string
  shop_name  :string
  shop_type   :string 
}

export interface AdminLogin_Data{
email  :string      
  password?  :string
}

export interface NewPasswordData{
  email:string
   password  :string      
}
export interface UserData{
shop_id:string
admin_email:string
}
