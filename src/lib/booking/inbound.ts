import { getSql } from "@/lib/db";

export async function handleInboundWhatsapp(fromPhone: string, text: string) {
  const sql = await getSql();
  const digits = fromPhone.replace(/\D/g, "");
  const tail = digits.slice(-10);
  const customers = await sql<{ id: number; business_id: number; name: string }>`
    select id, business_id, name from customers
    where right(regexp_replace(phone, '[^0-9]', '', 'g'), 10) = ${tail}
  `;
  if (!customers[0]) return { handled: false };
  const reply = text.trim().toUpperCase();
  const yes = ["YES", "Y", "HAAN", "OK", "CONFIRM"].includes(reply);
  const no = ["NO", "N", "CANCEL"].includes(reply);
  if (!yes && !no) {
    await sql`
      insert into wa_messages (business_id, customer_id, direction, body, simulated)
      values (${customers[0].business_id}, ${customers[0].id}, 'in', ${text.slice(0, 500)}, false)
    `;
    return { handled: true };
  }
  const booking = await sql<{ id: number }>`
    select id from bookings
    where customer_id = ${customers[0].id} and status = 'pending'
    order by starts_at
    limit 1
  `;
  if (booking[0]) {
    const status = yes ? "confirmed" : "cancelled";
    await sql`update bookings set status = ${status}, source = 'whatsapp' where id = ${booking[0].id}`;
    if (!yes) {
      await sql`update reminder_jobs set status = 'skipped' where booking_id = ${booking[0].id} and status = 'queued'`;
    }
  }
  await sql`
    insert into wa_messages (business_id, customer_id, booking_id, direction, body, simulated)
    values (${customers[0].business_id}, ${customers[0].id}, ${booking[0]?.id ?? null}, 'in', ${text.slice(0, 500)}, false)
  `;
  return { handled: true };
}
