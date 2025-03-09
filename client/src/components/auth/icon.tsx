

export function IconSvg(
  {
    height="6em",
    width="3em"
  }:{
    height?:string,
    width?:string
  }
) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className=" fill-[#34D399] text-[#34D399]"
      width={width}
      height={height}
      viewBox="0 0 14 14"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M13 8.75v-1.5C13 3.54 10.3.5 7 .5h0c-3.3 0-6 3-6 6.75v6.25m3-2.25v2.25"></path>
        <path d="M10 13.5V8c0-2.06-1.35-3.75-3-3.75h0C5.35 4.25 4 5.94 4 8v.75M7 12v1.5m0-6.25V9.5m6 4v-2"></path>
      </g>
    </svg>
  );
}
export default function Icon(
  {
    title
  }:{
    title:string
  }
) {
  return (
    <div>
      <div className="flex h-[35px]  -translate-y-10 justify-center">
        <IconSvg />
      </div>
      <div className="mb-8 text-center text-xl font-semibold text-zinc-900 mt-4">
        {title}
      </div>
    </div>
  );
}
