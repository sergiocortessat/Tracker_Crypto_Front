import { useAuth0 } from '@auth0/auth0-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers, postMeasurements } from '../API/API';
import { updateUser } from '../Redux/Actions';
import '../Style/AddMeasurement.scss';
import customAlert from './PopUpAlert';

const AddMeasurement = () => {
  const { coins } = useSelector((state) => state.coins);
  const [coin, setCoin] = useState(1);
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user);
  const { user, getAccessTokenSilently } = useAuth0();
  const [unit, setUnit] = useState('');

  useEffect(() => {
    getUsers().then((res) => {
      const filtered = res.filter((a) => a.sub === user.sub);
      dispatch(updateUser(filtered[0]));
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const tempGoal = currentUser.user.coins.filter((c) => c.id === Number(coin))[0].goals;
    const goalID = tempGoal.filter((g) => g.sub === user.sub)[0].id;
    const userID = currentUser.user.id;
    getAccessTokenSilently()
      .then((accessToken) => {
        postMeasurements({ user_id: userID, goal_id: goalID, unit }, accessToken);
      });
    setTimeout(() => {
      setUnit('');
      customAlert('Measure added', 'green');
    }, 1000);
  };

  return (
    <div className="add-measurement">
      <h1>Add a Measurement</h1>
      <form>
        <label className="main-label" htmlFor="coins">
          <span>
            Choose a Crypto:
          </span>
          <select id="coins" name="coins" onChange={(e) => setCoin(e.target.value)}>
            {coins && coins.map((coin) => (
              <option
                key={coin.id}
                value={coin.id}
              >
                {coin.name === 'Cardano (ADA)' ? 'Cardano' : coin.name}
              </option>
            ))}
          </select>
          <label className="second-label" htmlFor="quantity">
            <input placeholder="Units" value={unit} type="number" pattern="\d*" id={coin} step={0.01} min="0" max={10} onChange={(e) => setUnit(e.target.value)} />

          </label>
          <input type="submit" value="Submit" id={coin} onClick={(e) => handleSubmit(e)} />
        </label>
      </form>
    </div>

  );
};

export default AddMeasurement;
