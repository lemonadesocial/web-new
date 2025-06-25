export function ClaimStep() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h3 className="text-3xl font-semibold">Claim LemonHead</h3>
        <p className="text-tertiary">
          Let’s bring your avatar to life. Just follow these quick steps to mint your one-of-a-kind LemonHead.
        </p>
      </div>

      <ul className="steps steps-vertical">
        <li className="step step-primary">Register</li>
        <li className="step step-primary">Choose plan</li>
        <li className="step">Purchase</li>
        <li className="step">Receive Product</li>
      </ul>
    </div>
  );
}
