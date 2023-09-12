import React from 'react';
import styles from './App.module.css';
import Form from './lib/components/Form';

const App: React.FC = () => (
  <main className={styles.main}>
    <article className={styles.textBox}>
      <h1>Verify your email address</h1>
      <p>
        A four-digit code has been sent to your email name@frontendpro.dev.
        <br /> Please enter the code below to verify your email address.
      </p>
    </article>
    <Form />
  </main>
);

export default App;
