import React from 'react';
import { Button, Checkbox, DatePicker, Form, Typography } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import './ContingencyForm.css';

const { Title, Text } = Typography;

export const ContingencyForm: React.FC = () => {
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const disableWeekEnds = (current) => {
    return (
      // current < Date.now() || // day before today
      new Date(current).getDay() === 0 || // sundays
      new Date(current).getDay() === 6 // saturdays
    );
  };

  return (
    <Form
      name="basic"
      // form={form}
      //   initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      layout="vertical"
    >
      <div className="contingency-form-row">
        <Title level={4}>Contingency</Title>
        <Text>
          <b>Folio</b> 1234 algo así
        </Text>
      </div>

      <div className="contingency-form-row">
        <Form.Item
          label="Date"
          name="date"
          rules={[{ required: true, message: 'Please enter a date!' }]}
        >
          <DatePicker
            style={{ width: '100%' }}
            format="DD/MM/YYYY"
            disabledDate={disableWeekEnds}
          />
        </Form.Item>

        <Form.Item
          label="Half Day"
          name="halfday"
          valuePropName="checked"
          //   wrapperCol={{ offset: 8, span: 16 }}
        >
          <Checkbox />
        </Form.Item>
      </div>

      <Form.Item
        label="Message"
        name="message"
        // rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <TextArea
          autoSize={{ minRows: 4, maxRows: 4 }}
          rows={4}
          placeholder="Write your comments here..."
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};