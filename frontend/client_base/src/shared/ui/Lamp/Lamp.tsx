import './Lamp.scss'

interface BulbProps {
    status?: boolean;
    size?: 0|1|2|3|4|5|6|string; // Добавил string для кастомных размеров
    color?: string;
    className?: string;
    onClick?: (event: React.MouseEvent<HTMLOrSVGElement>) => void;
}
// cdcaaf
export const Bulb = ({className = "", status = false, size = 1, color = "#cdcaaf", onClick}: BulbProps) => {
    const baseColor = "var(--Tertiary-container-color)";
    const Color2 = "var(--Tertiary-color)";
    
    const sizeList = [
        "50px",
        "75px",
        "100px",
        "125px",
        "150px",
        "175px",
        "200px"
    ];

    const styleSVG = {
      "--color-bulb": color,
      "--size-bulb": typeof size === 'number' ? sizeList[size] : size
    } as React.CSSProperties 

    return (
      <div className={`bulb-element ${className}`} style={styleSVG}>
      <svg 
            onClick={onClick} 
            className={`blub-svg ${status ? 'active' : 'inactive'}`}
            role="img"
            aria-label={status ? 'Лампочка включена' : 'Лампочка выключена'}
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 200 200" 
            shapeRendering="geometricPrecision" 
            textRendering="geometricPrecision"
        >
          <defs>
            <filter id="soft-shadow" x="-150%" y="-150%" width="400%" height="400%">
              <feDropShadow dx="0" dy="0" stdDeviation="1" floodColor="var(--Shadow-color)" />
            </filter>
          </defs>
            <path 
                d="M53.967074,259.275581c0-16.165145,49.172058-67.381159,98.122699-67.381159s93.943153,54.228722,93.943153,67.381159h-192.065852Z" 
                transform="matrix(1 0 0 1.015637-50-88.474461)" 
                fill={baseColor} 
                strokeWidth="0.6"
                filter="url(#soft-shadow)"
            />
            
            <ellipse 
                rx="96.032926" 
                ry="13.094674" 
                transform="matrix(1 0 0 0.6 100 174.855412)" 
                fill={Color2} 
                strokeWidth="0"
            />
            
            <ellipse 
                rx="96.032926" 
                ry="13.094674" 
                transform="matrix(.95 0 0 0.5 100 174.855411)" 
                fill={Color2} 
                strokeWidth="0"
                className='bulb-inside'
            />
            <path 
                d="M103.917792,241.75009h46.11666c-11.771671,5.045588-16.360378,5.987116-22.902811,5.987116-6.457991,0-10.827046-.638738-23.213849-5.987116Z" 
                transform="translate(-26.976122-73.442016)" 
                fill={color ?? `#cdcaaf`}
                strokeWidth="0.5"
            />
            
            <rect 
                width="13.931821" 
                height="20.123742" 
                rx="0" 
                ry="0" 
                transform="matrix(-.322461 0 0 4.249386 102.246235 0.000001)" 
                fill={baseColor} 
                strokeWidth="0"
            />
            
            <path 
                d="M159.570222,180.935261v-24.254169C159.628098,150,159.57338,150,151.611823,150c-7.958399,0-7.958399,0-7.80681,6.681092l-.151589,24.254169h15.916798Z" 
                transform="translate(-51.615126-70.227252)" 
                fill={baseColor} 
                strokeWidth="0.6"
            />
        </svg>
        {
          status && 
          <span className='bulb-light'></span>
        }
      </div>
    )
}

