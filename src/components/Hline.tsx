type Props = {
  h?: string;
  w?: string;
  bg?: string;
  mt?: string;
  mb?: string;
  mr?: string;
  ml?: string;
  lf?: string;
  z?: string;
};

const Hline = ({
  h = "2px",
  w = "24px",
  bg = "#ee7744",
  mb = "4px",
  ml = "0",
  mr = "0",
  mt = "4px",
  lf = "10px",
  z = "-9",
}: Props) => {
  return (
    <span
      className="block relative z-[-9]"
      style={{
        height: h,
        width: w,
        backgroundColor: bg,
        marginTop: mt,
        marginBottom: mb,
        marginRight: mr,
        marginLeft: ml,
        left: lf,
        zIndex: z,
      }}
    ></span>
  );
};

export default Hline;
