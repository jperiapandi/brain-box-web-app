import type React from "react";
interface AttributeProps {
  icon: string;
  label: string;
}
const Attribute: React.FunctionComponent<AttributeProps> = ({
  icon,
  label,
}) => {
  return (
    <div className="attribute-cmp">
      <span className="material-symbols-rounded">{icon}</span>
      <span>{label}</span>
    </div>
  );
};

export default Attribute;
