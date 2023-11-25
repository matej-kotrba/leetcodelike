import { json } from "@sveltejs/kit"
import ivm from "isolated-vm"

export const POST = async ({ request }) => {
  const { code } = await request.json()
  console.log(code)
  if (!code) throw new Error('No code provided');

  const isolate = new ivm.Isolate();
  const context = await isolate.createContext();

  try {
    const result = await (await isolate.compileScript(code)).run(context);
    console.log(result)
    if (result === undefined) return json('undefined');
    return json(result.toString());
  } catch (error) {
    throw new Error(error);
  } finally {
    await isolate.dispose();
  }
}