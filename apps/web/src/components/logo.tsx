import * as React from "react"

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number
}

export function Logo({ size = 24, className, ...props }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* A bullion bar — tapered top face + wider front face, echoing the
          shape of the bars this app actually prices, instead of the
          generic shopping-cart glyph from the original dashboard template. */}
      <path d="M10 7H22L25.5 13H6.5L10 7Z" fill="currentColor" fillOpacity="0.55" />
      <path d="M6.5 13H25.5L28.5 25H3.5L6.5 13Z" fill="currentColor" />
    </svg>
  )
}
