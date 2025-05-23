import { useEffect, useState } from "react"
import UserRepository, { User } from "../../repositories/User/UserRepository"
import Input from "../form/input/InputField"
import Label from "../form/Label"
import Button from "../ui/button/Button"
import { toast } from "react-toastify"
import AuthRepository from "../../repositories/Auth/AuthRepository"
import useAuth from "../../hooks/useAuth"

export default function UserUpdateForm({ user, onClose }: { user: User; onClose: () => void  }) {
  const { setLoggedUser } = useAuth();
  const [name, setName] = useState(user.name)
  const [nick, setNick] = useState(user.nick)
  const [email, setEmail] = useState(user.email)
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  useEffect(() => {
    setName(user.name)
    setNick(user.nick)
    setEmail(user.email)
  }, [user])
  
  const handleSave = () => {
    if (oldPassword !== "" && newPassword !== "" && confirmPassword !== "") {
      // Check if newPassword match confirmPAssword
      if (newPassword !== confirmPassword) {
        toast.error("New Password and Confirm not matched")
        return
      }

      AuthRepository.updatePassword({ oldPassword, newPassword})
        .then(() => {
          toast.success("Password updated successfully")
        })
        .catch((error) => {
          toast.error(error.message)
          return
        })
    }


    if (name !== user.name || nick !== user.nick || email !== user.email) {
      UserRepository.update(user.id, {
        name,
        nick,
        email
      })
        .then(({ data }) => {
          toast.success("User updated successfully")
          setLoggedUser(data)
        })
        .catch((error) => {
          toast.error(error.message)
          return
        })
    }

    onClose()
  }

  return (
    <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
      <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
        <div className="mt-7">
          <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h5>

          <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
            <div className="col-span-2 lg:col-span-1">
              <Label>Name</Label>
              <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="col-span-2 lg:col-span-1">
              <Label>Nick</Label>
              <Input type="text" value={nick} onChange={(e) => setNick(e.target.value)} />
            </div>

            <div className="col-span-2 lg:col-span-1">
              <Label>Email Address</Label>
              <Input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="mt-7">
          <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
            Update Password
          </h5>

          <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
            <div className="col-span-2 lg:col-span-1">
              <Label>Old Password</Label>
              <Input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
            </div>

            <div className="col-span-2 lg:col-span-1">
              <Label>New Password</Label>
              <Input type="text" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>

            <div className="col-span-2 lg:col-span-1">
              <Label>Confirm New Password</Label>
              <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
        <Button size="sm" variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button size="sm" onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </form>
  )
}