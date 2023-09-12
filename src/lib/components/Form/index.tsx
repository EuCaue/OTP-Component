import React from 'react';
import styles from './styles.module.css';

const Input: React.FC<{
  setOtpDigit: React.Dispatch<React.SetStateAction<number>>;
  otpDigit: number;
  pasteOccurred: boolean;
}> = ({ setOtpDigit, otpDigit, pasteOccurred }) => {
  const $inputRef = React.useRef<HTMLInputElement | null>(null);

  const handleInputChange = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>): void => {
      const newValue = ev.target.value;
      if (/^\d*$/.test(newValue) && newValue.length <= 1) {
        setOtpDigit(Number(newValue));
        if (newValue.length >= 1) {
          const nextInput =
            ev.currentTarget.parentElement?.nextElementSibling?.querySelector(
              'input'
            );
          if (nextInput != null) {
            nextInput.focus();
          }
        }
      }
    },
    [setOtpDigit]
  );

  const handleKeyDown = React.useCallback(
    (ev: React.KeyboardEvent<HTMLInputElement>): void => {
      if (ev.key === 'Backspace' && Number(ev.currentTarget.value) <= 1) {
        ev.currentTarget?.parentElement?.previousElementSibling
          ?.querySelector('input')
          ?.focus();
      }
    },
    []
  );

  React.useEffect(() => {
    if (pasteOccurred) {
      $inputRef.current?.focus();
    }
  }, [pasteOccurred]);

  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label
      className={styles.label}
      style={{ border: otpDigit === 0 ? '' : '1px solid #b1b9d8' }}
    >
      <input
        type="text"
        required
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="0"
        className={styles.input}
        value={otpDigit === 0 ? '' : String(otpDigit)}
        maxLength={1}
        pattern="[0-9]"
        ref={$inputRef}
      />
    </label>
  );
};

export const Form: React.FC = () => {
  const [otpDigits, setOtpDigits] = React.useState<number[]>([0, 0, 0, 0]);
  const [pasteOccurred, setPasteOccurred] = React.useState<boolean>(false);
  const OTP = '1612';
  const $formRef = React.useRef<HTMLFormElement | null>(null);
  const $inputsContainerRef = React.useRef<HTMLSpanElement | null>(null);

  const handleClipboard = React.useCallback(
    (ev: React.ClipboardEvent<HTMLFormElement>): void => {
      ev.preventDefault();
      const yank = ev.clipboardData.getData('text').trim();
      setOtpDigits([...otpDigits]);
      if (/^\d{4}$/.test(yank)) {
        const newOtpDigits = yank.split('').map(Number);
        setOtpDigits([...newOtpDigits]);
        setPasteOccurred(true);
      } else {
        alert('Please enter a valid 4-digit OTP');
      }
    },
    [otpDigits]
  );

  const handleSubmit = React.useCallback(
    (ev: React.FormEvent<HTMLFormElement>): void => {
      ev.preventDefault();
      const isValid = otpDigits.join('') === OTP;

      $inputsContainerRef.current?.childNodes.forEach((node) => {
        console.log(node);
        const $inputElement = node as HTMLLabelElement;
        if (isValid) {
          $inputElement.style.border = '1px solid green';
          return;
        }
        $inputElement.style.border = '1px solid red';
      });

      setTimeout(() => {
        if (isValid) alert('The OTP is correct');
        if (!isValid) alert('The OTP is incorrect');
      }, 250);
    },
    [otpDigits]
  );

  React.useEffect(() => {
    if (pasteOccurred) {
      $formRef.current?.requestSubmit();
      setPasteOccurred(false);
    }
  }, [pasteOccurred]);

  return (
    <form
      className={styles.form}
      id="otp-form"
      ref={$formRef}
      onSubmit={handleSubmit}
      onPaste={handleClipboard}
    >
      <span
        className={styles.span}
        ref={$inputsContainerRef}
      >
        {otpDigits.map((digit, index) => (
          <Input
            key={Math.abs(index)}
            pasteOccurred={pasteOccurred}
            setOtpDigit={(newDigit) => {
              const newOtpDigits = [...otpDigits];
              newOtpDigits[index] = Number(newDigit);
              setOtpDigits(newOtpDigits);
            }}
            otpDigit={digit}
          />
        ))}
      </span>
      <button
        type="submit"
        className={styles.btnSubmit}
      >
        Verify OTP
      </button>
    </form>
  );
};

export default Form;
