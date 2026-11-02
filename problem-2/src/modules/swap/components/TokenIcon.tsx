import { useState } from 'react';

interface TokenIconProps {
  symbol: string;
}

export default function TokenIcon({ symbol }: TokenIconProps) {
  const [failed, setFailed] = useState(false);
  const iconPath = `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${symbol}.svg`;

  return (
    <span className="token-icon" aria-hidden="true">
      {!failed ? <img src={iconPath} alt="" onError={() => setFailed(true)} /> : <span>{symbol.slice(0, 1)}</span>}
    </span>
  );
}
