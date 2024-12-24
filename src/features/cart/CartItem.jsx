import { useDispatch } from 'react-redux';
import Button from '../../ui/Button';
import { formatCurrency } from '../../utils/helpers';
import { getCurrentQuantityByID, removeItem } from './cartSlice';
import DeleteItem from './DeleteItem';
import UpdateItemQuantity from './UpdateItemQuantity';

function CartItem({ item }) {
  const dispatch = useDispatch();
  const { pizzaId, name, quantity, totalPrice } = item;

  return (
    <li className="py-3 sm:flex sm:items-center sm:justify-between">
      <p className="mb-1 sm:mb-0">
        {quantity}&times; {name}
      </p>
      <div className="flex items-center justify-between sm:gap-6">
        <p className="text-sm font-bold">{formatCurrency(totalPrice)}</p>

        {/* <Button type="small" onClick={() => dispatch(removeItem(pizzaId))}>
          Delete
        </Button> */}

        <UpdateItemQuantity pizzaId={pizzaId} currentQuantity={quantity} />

        <DeleteItem onClick={() => dispatch(removeItem(pizzaId))} />
      </div>
    </li>
  );
}

export default CartItem;
