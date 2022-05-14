import { useState } from 'react'
import logo from './logo.svg'
import Form from './Form';
import FormItem from './Form/FormItem';
import { Input } from './Form/FormControl';
import './App.css'

function App() {

  return (
    <div className="App">
      <Form onFinish={values => console.log(values)} onFinishFailed={err => console.log(err)}>
        <FormItem label="姓名" name="name" rules={[{required: true, message: '不能为空'}]}>
          <Input />
        </FormItem>
        <button type="submit">提交</button>
      </Form>
    </div>
  )
}

export default App
