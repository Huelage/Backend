const APLPHABETS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';

export function genRandomOtp(): number {
  return Math.floor(1000 + Math.random() * 9000);
}

export function genEmailMessage(input: { name: string; otp: number }): string {
  const { name, otp } = input;
  return `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Zero Waste</a>
    </div>
    <p style="font-size:1.1em">Hi, ${name}.</p>
    <p>Thank you for choosing Huelage. Here is your OTP</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;"> ${otp}</h2>
    <p style="font-size:0.9em;">Regards, <br />Huelage. </p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300"></div>
  </div>
</div>`;
}

export function generateVendorKey(): string {
  let key = '';
  for (let i = 0; i < 2; i++) {
    key += APLPHABETS.charAt(Math.floor(Math.random() * APLPHABETS.length));
  }
  for (let i = 0; i < 4; i++) {
    key += NUMBERS.charAt(Math.floor(Math.random() * NUMBERS.length));
  }
  for (let i = 0; i < 2; i++) {
    key += APLPHABETS.charAt(Math.floor(Math.random() * APLPHABETS.length));
  }
  return key;
}
