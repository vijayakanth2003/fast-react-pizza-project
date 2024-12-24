import React from 'react';
import Button from '../../ui/Button';
import { useDispatch } from 'react-redux';
import {
  decrementItemQuantity,
  incrementItemQuantity,
  removeItem,
} from './cartSlice';

const UpdateItemQuantity = ({ pizzaId, currentQuantity }) => {
  const dispatch = useDispatch();

  return (
    <div className="flex items-center gap-1 md:gap-3">
      <Button
        type="round"
        onClick={() => dispatch(decrementItemQuantity(pizzaId))}
      >
        -
      </Button>

      <span className="text-sm font-bold">{currentQuantity}</span>

      <Button
        type="round"
        onClick={() => dispatch(incrementItemQuantity(pizzaId))}
      >
        +
      </Button>
    </div>
  );
};

export default UpdateItemQuantity;
