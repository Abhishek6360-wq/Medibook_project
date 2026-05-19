/**
 * Calendar Slot Calculation Engine
 * 
 * INTERVIEW TOPIC: Separation of Concerns (SoC) & Pure Utility Functions
 * 
 * Purpose:
 * Generates rolling 7-day appointment slots (30-minute intervals starting from 10:00 AM to 9:00 PM),
 * while filtering out slots that the doctor has already booked.
 * 
 * Advantages:
 * 1. Highly testable: Easy to write unit tests for slot calculations without mounting any React components.
 * 2. Optimized: Allows React's useMemo to easily caching calculation results.
 * 3. Adaptable: Easy to adjust start/end hours or slot intervals (e.g. 15 or 45 mins) in one place.
 */

/**
 * Calculates all available 30-minute booking intervals for a doctor over the next 7 days.
 * 
 * @param {Object} doctor - Doctor object containing booked slots
 * @param {number} dailyEndHour - Standard clinic closing hour (e.g., 21 for 9 PM)
 * @param {number} startHour - Standard clinic opening hour (e.g., 10 for 10 AM)
 * @returns {Array<Array<{datetime: Date, time: string}>>} Grouped timeslots array
 */
export const calculateAvailableSlots = (doctor, dailyEndHour = 21, startHour = 10) => {
  if (!doctor) return [];
  const allSlots = [];
  let today = new Date();

  for (let i = 0; i < 7; i++) {
    let currentDate = new Date(today);
    currentDate.setDate(today.getDate() + i);

    let endTime = new Date(currentDate);
    endTime.setHours(dailyEndHour, 0, 0, 0);

    // If it's today, dynamic start based on the current time
    if (i === 0) {
      let now = new Date();
      if (now.getHours() < startHour) {
        currentDate.setHours(startHour, 0, 0, 0);
      } else {
        let minutes = now.getMinutes();
        let newMinutes = minutes < 30 ? 30 : 60;
        currentDate = new Date(now);
        if (newMinutes === 60) {
          currentDate.setHours(currentDate.getHours() + 1, 0, 0, 0);
        } else {
          currentDate.setMinutes(newMinutes, 0, 0);
        }
      }
    } else {
      currentDate.setHours(startHour, 0, 0, 0);
    }

    let timeslots = [];
    while (currentDate < endTime) {
      let formattedTime = currentDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      let day = currentDate.getDate();
      let month = currentDate.getMonth() + 1;
      let year = currentDate.getFullYear();

      const slot_date = `${day}/${month}/${year}`;
      const slot_time = formattedTime;

      // Filter out slots that are already booked
      const isSlotAvailable = !(doctor.slots_booked?.[slot_date] && doctor.slots_booked[slot_date].includes(slot_time));

      if (isSlotAvailable) {
        timeslots.push({
          datetime: new Date(currentDate),
          time: formattedTime
        });
      }
      currentDate.setMinutes(currentDate.getMinutes() + 30);
    }

    if (timeslots.length > 0) {
      allSlots.push(timeslots);
    }
  }
  return allSlots;
};
