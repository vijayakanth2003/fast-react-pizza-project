import { Link } from 'react-router-dom';
import LinkButton from '../../ui/LinkButton';

function EmptyCart() {
  return (
    <div className=" px-4 py-3">
      <LinkButton to="/menu">&larr; Back to menu</LinkButton>

      <h2 className="fontf-semibold mt-7 text-xl">
        Your cart is still empty. Start adding some pizzas :)
      </h2>
    </div>
  );
}

export default EmptyCart;
